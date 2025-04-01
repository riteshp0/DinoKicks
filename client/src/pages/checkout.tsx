import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const checkoutFormSchema = z.object({
  // Shipping info
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "ZIP code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  
  // Payment info
  cardName: z.string().min(2, { message: "Name on card is required" }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Invalid card number" }),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Invalid expiry date (MM/YY)" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "Invalid CVV" }),
  
  // Same billing as shipping option
  sameBilling: z.boolean().default(true),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Checkout steps
type CheckoutStep = "shipping" | "payment" | "confirmation";

const Checkout = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Get cart data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    staleTime: 0,
  });

  // Form definition
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      sameBilling: true,
    },
  });

  // Handle order creation
  const createOrderMutation = useMutation({
    mutationFn: async (formData: CheckoutFormValues) => {
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Calculate totals
      const subtotal = cartData.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 
        0
      );
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      // Prepare shipping address
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      };

      // Prepare order data
      const orderData = {
        userId: null, // Guest checkout
        total,
        status: "pending",
        shippingAddress,
        billingAddress: formData.sameBilling ? shippingAddress : null,
        paymentMethod: "credit_card",
        items: cartData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          color: item.color,
          size: item.size,
        })),
      };

      // Create order
      const response = await apiRequest("POST", "/api/orders", orderData);
      return await response.json();
    },
    onSuccess: (data) => {
      // Save order ID
      setOrderId(data.id);
      setOrderComplete(true);
      
      // Clear cart
      localStorage.setItem("sessionId", Math.random().toString(36).substring(2, 15));
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      
      // Show success message
      toast({
        title: "Order Complete!",
        description: "Your order has been successfully placed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CheckoutFormValues) => {
    if (currentStep === "shipping") {
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      createOrderMutation.mutate(data);
      setCurrentStep("confirmation");
    }
  };

  // Calculate cart totals
  const subtotal = cartData?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;
  
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Check if cart is empty
  const cartIsEmpty = !isLoading && (!cartData?.items || cartData.items.length === 0);

  // If order is complete, show confirmation
  if (orderComplete && orderId) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation | Dino Kicks</title>
          <meta name="description" content="Thank you for your order at Dino Kicks!" />
        </Helmet>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-4">
              Your Order Has Been Placed!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order #DK{orderId} has been confirmed.
            </p>
            
            <div className="bg-[#F5F5F5] p-6 rounded-lg mb-8 text-left inline-block mx-auto">
              <p className="mb-2">
                <span className="font-medium">Order Number:</span> DK{orderId}
              </p>
              <p className="mb-2">
                <span className="font-medium">Order Date:</span> {new Date().toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Order Total:</span> ${total.toFixed(2)}
              </p>
            </div>
            
            <p className="mb-8">
              We've sent a confirmation email to your inbox with all the details of your purchase.
              Your prehistoric kicks are on their way to becoming extinct from our inventory!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-[#2D3436] font-['Righteous',_cursive]"
              >
                <Link href="/">
                  BACK TO HOME
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                asChild
                className="border-[#2D3436] text-[#2D3436] hover:bg-[#2D3436] hover:text-white font-['Righteous',_cursive]"
              >
                <Link href="/products">
                  CONTINUE SHOPPING
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // If cart is empty, redirect to cart page
  if (cartIsEmpty) {
    return (
      <>
        <Helmet>
          <title>Checkout | Dino Kicks</title>
          <meta name="description" content="Complete your purchase at Dino Kicks - Prehistoric Kicks for Modern Feet." />
        </Helmet>

        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-6">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            You need to add some items to your cart before proceeding to checkout.
          </p>
          <Button 
            asChild
            className="bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-['Righteous',_cursive]"
          >
            <Link href="/products">SHOP NOW</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Dino Kicks</title>
        <meta name="description" content="Complete your purchase at Dino Kicks - Prehistoric Kicks for Modern Feet." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            asChild 
            className="mr-4"
            onClick={() => navigate("/cart")}
          >
            <Link href="/cart">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="font-['Righteous',_cursive] text-2xl md:text-3xl">CHECKOUT</h1>
        </div>

        {/* Checkout Progress Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative flex items-center justify-between">
            <div className="w-full absolute h-1 bg-gray-200">
              <div 
                className="h-full bg-[#39FF14] transition-all duration-300"
                style={{ 
                  width: currentStep === "shipping" 
                    ? "0%" 
                    : currentStep === "payment" 
                      ? "50%" 
                      : "100%" 
                }}
              ></div>
            </div>
            
            <div className={`relative flex flex-col items-center ${
              currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation" 
                ? "text-[#39FF14]" 
                : "text-gray-400"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation" 
                  ? "bg-[#39FF14] text-[#2D3436]" 
                  : "bg-gray-200"
              }`}>
                <MapPin className="h-5 w-5" />
              </div>
              <span className="mt-2 font-medium text-sm">Shipping</span>
            </div>
            
            <div className={`relative flex flex-col items-center ${
              currentStep === "payment" || currentStep === "confirmation" 
                ? "text-[#39FF14]" 
                : "text-gray-400"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                currentStep === "payment" || currentStep === "confirmation" 
                  ? "bg-[#39FF14] text-[#2D3436]" 
                  : "bg-gray-200"
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="mt-2 font-medium text-sm">Payment</span>
            </div>
            
            <div className={`relative flex flex-col items-center ${
              currentStep === "confirmation" 
                ? "text-[#39FF14]" 
                : "text-gray-400"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                currentStep === "confirmation" 
                  ? "bg-[#39FF14] text-[#2D3436]" 
                  : "bg-gray-200"
              }`}>
                <Check className="h-5 w-5" />
              </div>
              <span className="mt-2 font-medium text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#39FF14]"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Shipping Information */}
                  {currentStep === "shipping" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-['Righteous',_cursive] text-xl mb-6 flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-[#FF5714]" />
                          SHIPPING INFORMATION
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Dino Street" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-[#2D3436] font-['Righteous',_cursive]"
                        >
                          CONTINUE TO PAYMENT
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Information */}
                  {currentStep === "payment" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-['Righteous',_cursive] text-xl mb-6 flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-[#FF5714]" />
                          PAYMENT INFORMATION
                        </h2>
                        
                        <Tabs defaultValue="credit-card" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                            <TabsTrigger value="paypal" disabled>PayPal</TabsTrigger>
                          </TabsList>
                          <TabsContent value="credit-card" className="mt-4">
                            <FormField
                              control={form.control}
                              name="cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on Card</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="1234 5678 9012 3456" 
                                      {...field}
                                      onChange={(e) => {
                                        // Allow only numbers
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date (MM/YY)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="MM/YY" 
                                        {...field}
                                        onChange={(e) => {
                                          let value = e.target.value.replace(/[^\d/]/g, '');
                                          if (value.length === 2 && !value.includes('/') && field.value.length < 3) {
                                            value += '/';
                                          }
                                          field.onChange(value);
                                        }}
                                        maxLength={5}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="123" 
                                        {...field}
                                        onChange={(e) => {
                                          // Allow only numbers
                                          const value = e.target.value.replace(/\D/g, '');
                                          field.onChange(value);
                                        }}
                                        maxLength={4}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="mt-6">
                          <h3 className="font-['Righteous',_cursive] text-lg mb-4">BILLING ADDRESS</h3>
                          
                          <FormField
                            control={form.control}
                            name="sameBilling"
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="sameBilling"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 rounded border-gray-300 text-[#39FF14] focus:ring-[#39FF14]"
                                />
                                <Label htmlFor="sameBilling">Same as shipping address</Label>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setCurrentStep("shipping")}
                          className="font-['Righteous',_cursive]"
                        >
                          BACK TO SHIPPING
                        </Button>
                        
                        <Button 
                          type="submit" 
                          className="bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-['Righteous',_cursive]"
                          disabled={createOrderMutation.isPending}
                        >
                          {createOrderMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              PROCESSING...
                            </>
                          ) : (
                            "PLACE ORDER"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Order Confirmation/Processing */}
                  {currentStep === "confirmation" && !orderComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md p-8 text-center"
                    >
                      <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
                      </div>
                      <h2 className="font-['Righteous',_cursive] text-2xl mb-4">
                        PROCESSING YOUR ORDER
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Please wait while we secure your prehistoric kicks...
                      </p>
                      <div className="flex justify-center space-x-4 text-gray-400 mt-8">
                        <CreditCard className="h-6 w-6" />
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M9.112 8.262L5.97 15.758H3.92L2 8.262h1.938l1.036 5.026c.125.564.214 1.066.268 1.505h.036c.072-.396.179-.896.322-1.505l1.206-5.026h2.306zm2.704 0h1.876v7.496h-1.876v-7.496zm7.5 5.274c0 .75-.179 1.31-.536 1.681-.357.372-.902.558-1.634.558-.384 0-.724-.035-1.025-.107a4.66 4.66 0 01-.888-.295l.357-1.45c.143.072.357.161.58.268.224.107.47.161.741.161.348 0 .527-.161.527-.483v-.017c0-.161-.054-.286-.16-.376-.108-.09-.313-.179-.616-.268-.313-.089-.569-.179-.777-.268a1.87 1.87 0 01-.535-.358 1.353 1.353 0 01-.313-.549 2.543 2.543 0 01-.09-.742v-.02c0-.661.17-1.154.51-1.48.34-.325.83-.487 1.474-.487.339 0 .656.035.956.107.299.071.547.152.748.241l-.357 1.433a2.7 2.7 0 00-.491-.214 1.895 1.895 0 00-.616-.107c-.33 0-.491.134-.491.403v.018c0 .089.018.161.054.214a.483.483 0 00.16.152c.071.036.151.072.267.107.116.036.241.072.376.108.277.07.536.15.777.241.24.09.446.197.607.32.16.126.286.277.375.457.09.179.136.403.136.671zm2.502-5.274h1.876v7.496h-1.876v-7.496z"></path>
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M14.595 9.082h-5.04v1.517h4.782v1.517H9.555v1.517h5.04c.93-.24 1.563-1.096 1.563-2.275s-.633-2.036-1.563-2.276zM0 7.908v8.089h24v-8.089H0zm2.351 4.728c0-1.165.963-2.299 2.557-2.299h3.413c.473 0 .89.134 1.187.381V9.082h1.563v4.553h-1.563v-.634c-.297.254-.714.38-1.187.38H4.908c-1.594.007-2.557-1.127-2.557-2.291v-.008-.146.008z"></path>
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </form>
              </Form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="font-['Righteous',_cursive] text-xl mb-4">ORDER SUMMARY</h2>
                
                <div className="space-y-4">
                  {cartData?.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF5714] rounded-full text-white text-xs flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <span className="ml-3 text-sm">{item.product.name}</span>
                      </div>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-6 space-y-3 text-xs text-gray-500">
                  <div className="flex items-start">
                    <Truck className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Free shipping on all orders over $50. Delivery typically takes 3-5 business days.</span>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All transactions are secure and encrypted for your protection.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
