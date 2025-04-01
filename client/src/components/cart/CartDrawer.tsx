import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  CreditCard 
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  
  // Get cart data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    staleTime: 0,
  });

  // Close drawer when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    
    // Prevent scrolling when drawer is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      return apiRequest("PUT", `/api/cart/items/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    }
  });

  // Delete cart item mutation
  const deleteCartItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove cart item",
        variant: "destructive",
      });
    }
  });

  // Apply promo code
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Promo Code Applied",
      description: "Your promo code has been applied!",
    });
    
    setPromoCode("");
  };

  // Calculate cart totals
  const subtotal = cartData?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="h-full flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="bg-white w-full max-w-md h-full overflow-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 bg-[#2D3436] text-white">
                <div className="flex justify-between items-center">
                  <h2 className="font-['Righteous',_cursive] text-2xl flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    DINO DIG SITE
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#39FF14] hover:bg-transparent"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-[#F5F5F5]">
                  Your unearthed discoveries ({cartData?.items?.length || 0} items)
                </p>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#39FF14]"></div>
                  </div>
                ) : cartData?.items?.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mb-4">
                      <ShoppingCart className="h-16 w-16 mx-auto text-gray-300" />
                    </div>
                    <h3 className="font-['Righteous',_cursive] text-xl mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any Dino Kicks yet.</p>
                    <Button
                      className="bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-['Righteous',_cursive]"
                      onClick={onClose}
                    >
                      CONTINUE SHOPPING
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    {cartData?.items?.map((item) => (
                      <div key={item.id} className="flex border-b border-gray-200 pb-4 mb-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-['Righteous',_cursive]">{item.product.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-[#FF5714] -mt-1 -mr-1"
                              onClick={() => deleteCartItemMutation.mutate(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            Size: {item.size} | Color:{" "}
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="px-2 py-1 text-gray-500 hover:text-[#FF5714] h-8"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateCartItemMutation.mutate({
                                      id: item.id,
                                      quantity: item.quantity - 1,
                                    });
                                  }
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="px-2 py-1 text-gray-500 hover:text-[#FF5714] h-8"
                                onClick={() => {
                                  updateCartItemMutation.mutate({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  });
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Cart Summary */}
                    <div className="mt-6 bg-[#F5F5F5] p-4 rounded-lg relative overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 70% 90%, 50% 100%, 30% 90%, 10% 100%, 0 85%)" }}>
                      <div className="mb-2 flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="mb-2 flex justify-between">
                        <span>Shipping</span>
                        <span className="font-bold">Free</span>
                      </div>
                      <div className="mb-4 flex justify-between">
                        <span>Tax</span>
                        <span className="font-bold">${tax.toFixed(2)}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-300 flex justify-between">
                        <span className="font-['Righteous',_cursive] text-lg">TOTAL</span>
                        <span className="font-['Righteous',_cursive] text-lg">${total.toFixed(2)}</span>
                      </div>
                      
                      {/* Promo Code */}
                      <div className="mt-4">
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            placeholder="Promo Code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#008080]"
                          />
                          <Button
                            className="bg-[#008080] text-white font-['Righteous',_cursive] px-4 py-2 rounded-lg hover:bg-[#008080]/80 transition"
                            onClick={handleApplyPromoCode}
                          >
                            APPLY
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <div className="mt-6">
                      <Link href="/checkout" onClick={onClose}>
                        <Button
                          className="w-full bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-['Righteous',_cursive] py-3 rounded-lg transition flex items-center justify-center space-x-2"
                        >
                          <span>PROCEED TO CHECKOUT</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full mt-3 border-2 border-[#2D3436] text-[#2D3436] font-['Righteous',_cursive] py-2 rounded-lg hover:bg-[#2D3436] hover:text-white transition"
                        onClick={onClose}
                      >
                        CONTINUE SHOPPING
                      </Button>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-gray-500 mb-2">EXTINCT PAYMENT METHODS</p>
                      <div className="flex justify-center space-x-4 text-gray-400">
                        <CreditCard className="h-6 w-6" />
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M9.112 8.262L5.97 15.758H3.92L2 8.262h1.938l1.036 5.026c.125.564.214 1.066.268 1.505h.036c.072-.396.179-.896.322-1.505l1.206-5.026h2.306zm2.704 0h1.876v7.496h-1.876v-7.496zm7.5 5.274c0 .75-.179 1.31-.536 1.681-.357.372-.902.558-1.634.558-.384 0-.724-.035-1.025-.107a4.66 4.66 0 01-.888-.295l.357-1.45c.143.072.357.161.58.268.224.107.47.161.741.161.348 0 .527-.161.527-.483v-.017c0-.161-.054-.286-.16-.376-.108-.09-.313-.179-.616-.268-.313-.089-.569-.179-.777-.268a1.87 1.87 0 01-.535-.358 1.353 1.353 0 01-.313-.549 2.543 2.543 0 01-.09-.742v-.02c0-.661.17-1.154.51-1.48.34-.325.83-.487 1.474-.487.339 0 .656.035.956.107.299.071.547.152.748.241l-.357 1.433a2.7 2.7 0 00-.491-.214 1.895 1.895 0 00-.616-.107c-.33 0-.491.134-.491.403v.018c0 .089.018.161.054.214a.483.483 0 00.16.152c.071.036.151.072.267.107.116.036.241.072.376.108.277.07.536.15.777.241.24.09.446.197.607.32.16.126.286.277.375.457.09.179.136.403.136.671zm2.502-5.274h1.876v7.496h-1.876v-7.496z"></path>
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M14.595 9.082h-5.04v1.517h4.782v1.517H9.555v1.517h5.04c.93-.24 1.563-1.096 1.563-2.275s-.633-2.036-1.563-2.276zM0 7.908v8.089h24v-8.089H0zm2.351 4.728c0-1.165.963-2.299 2.557-2.299h3.413c.473 0 .89.134 1.187.381V9.082h1.563v4.553h-1.563v-.634c-.297.254-.714.38-1.187.38H4.908c-1.594.007-2.557-1.127-2.557-2.291v-.008-.146.008z"></path>
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                          <path d="M8.126 18.15A5.51 5.51 0 0 0 15.5 15.5c0-3.044-2.448-5.5-5.499-5.5a5.499 5.499 0 0 0-5.392 6.845L5.981 10h2.113l3.012 8.03a1.474 1.474 0 0 1-1.588.121zm-5.482-3.316c.107 3.858 2.903 7.029 6.643 7.029a6.727 6.727 0 0 0 6.537-5.171h-2.114a4.55 4.55 0 0 1-4.423 3.134c-2.523 0-4.582-2.058-4.582-4.579a4.533 4.533 0 0 1 1.069-2.927L2.644 14.834zm15.857-9.93c-1.228-.6-2.735-.939-4.298-.939-2.459 0-4.621.831-6.113 2.163l.887 2.174c.216.08.425.179.622.3.142.087.278.183.408.288a4.57 4.57 0 0 1 3.197-1.288c2.522 0 4.583 2.058 4.583 4.578a4.55 4.55 0 0 1-1.245 3.103l3.16-.001c.87-2.307.624-7.059-1.201-10.378z"></path>
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
