import { useState } from "react";
import { useParams, Link as WouterLink } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  RefreshCw,
  Check,
  ChevronRight,
  Heart,
  Box,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Get product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
  });

  // Set default selections when product data is loaded
  useState(() => {
    if (product && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
    if (product && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!selectedColor || !selectedSize) {
        throw new Error("Please select a color and size");
      }

      return apiRequest("POST", "/api/cart/items", {
        productId: Number(id),
        quantity,
        color: selectedColor,
        size: selectedSize,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.name} has been added to your wishlist.`,
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <WouterLink href="/products">Back to Products</WouterLink>
        </Button>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Skeleton */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Skeleton className="mb-4 h-[400px] w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <div className="flex items-center mb-4">
                <div className="flex">
                  <Skeleton className="h-5 w-5 mr-1" />
                  <Skeleton className="h-5 w-5 mr-1" />
                  <Skeleton className="h-5 w-5 mr-1" />
                  <Skeleton className="h-5 w-5 mr-1" />
                  <Skeleton className="h-5 w-5 mr-1" />
                </div>
                <Skeleton className="h-5 w-20 ml-2" />
              </div>
              <Skeleton className="h-8 w-32 mb-6" />

              <div className="mb-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="flex space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>

              <div className="mb-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="grid grid-cols-4 gap-2">
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                </div>
                <Skeleton className="h-5 w-32 mt-2" />
              </div>

              <div className="flex space-x-4 mb-8">
                <Skeleton className="w-24 h-12" />
                <Skeleton className="flex-1 h-12" />
              </div>

              <Skeleton className="h-40 mb-6" />

              <div className="flex flex-col lg:flex-row gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product?.name} | Dino Kicks</title>
        <meta name="description" content={product?.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <motion.div
                className="mb-4 h-[400px] overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  id="main-product-image"
                  src={product?.imageUrls[selectedImage]}
                  alt={product?.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div className="grid grid-cols-4 gap-2">
                {product?.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? "border-[#39FF14]" : "border-transparent"
                    } hover:border-[#39FF14] transition`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={url}
                      alt={`${product?.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* 360 View Placeholder */}
              <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <RefreshCw className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">360° View Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              {product?.badge && (
                <span
                  className={`
                    inline-block text-white text-sm font-bold py-1 px-3 rounded-full mb-2
                    ${product.badge === "HOT!" ? "bg-[#FF5714]" : ""}
                    ${product.badge === "NEW" ? "bg-[#008080]" : ""}
                    ${product.badge === "LIMITED" ? "bg-purple-600" : ""}
                  `}
                >
                  {product.badge}
                </span>
              )}
              <h1 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-2">
                {product?.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex text-[#FF5714]">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span className="text-sm ml-2">4.7 (126 reviews)</span>
              </div>
              <p className="text-2xl font-bold mb-6">${product?.price.toFixed(2)}</p>

              <div className="mb-6">
                <h2 className="font-['Righteous',_cursive] text-lg mb-2">Select Color</h2>
                <div className="flex space-x-3">
                  {product?.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                        color === selectedColor
                          ? "border-2 border-[#2D3436] ring-2 ring-offset-2 ring-[#2D3436]"
                          : "border-2 border-transparent hover:border-[#2D3436]"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-['Righteous',_cursive] text-lg mb-2">Select Size</h2>
                <div className="grid grid-cols-4 gap-2">
                  {product?.sizes.map((size) => (
                    <button
                      key={size}
                      className={`border-2 py-2 rounded-lg transition ${
                        size === selectedSize
                          ? "border-[#2D3436] bg-gray-100"
                          : "border-gray-300 hover:border-[#2D3436]"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-sm mt-2 text-gray-600 flex items-center cursor-pointer hover:text-[#FF5714] transition">
                  Size Guide <Ruler className="ml-1 h-4 w-4" />
                </p>
              </div>

              <div className="flex space-x-4 mb-8">
                <div className="w-24">
                  <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(value) => setQuantity(parseInt(value))}
                  >
                    <SelectTrigger className="w-full border-2 border-gray-300 rounded-lg py-2 px-3 focus:border-[#008080] focus:outline-none">
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Button
                    className="w-full bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-['Righteous',_cursive] py-3 px-6 rounded-lg transition flex items-center justify-center space-x-2 mt-5"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>ADDING...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-[#F5F5F5] rounded-xl p-6 mb-6">
                <h2 className="font-['Righteous',_cursive] text-xl mb-4 flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2 text-[#FF5714]"
                    fill="currentColor"
                  >
                    <path d="M13.04 14.69l1.07-2.14 5.18-5.3-2.75-2.75-5.3 5.18-2.14 1.07 3.94 3.94z M20 6.5l3 3-3 3-3-3 3-3z M14.37 7.29l1.92-1.92a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0L11.5 4.5c-3 3-6 6-6 8.5a7 7 0 0 0 7 7c2.5 0 5.5-3 8.5-6l1.96-1.96a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0l-1.92 1.92-3.84-3.84z" />
                  </svg>
                  DINO FACTS
                </h2>
                <p className="mb-4">{product?.dinoFacts?.split(".")[0]}.</p>
                <ul className="space-y-2 text-sm">
                  {product?.dinoFacts
                    ?.split(".")
                    .slice(1)
                    .filter(Boolean)
                    .map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="text-[#39FF14] mt-1 mr-2 h-4 w-4" />
                        <span>{fact.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <Button
                  variant="outline"
                  className="text-center bg-[#008080] hover:bg-[#008080]/80 transition text-white font-['Righteous',_cursive] py-2 px-4 rounded-lg flex-1 flex items-center justify-center space-x-2"
                >
                  <Box className="h-4 w-4" />
                  <span>TRY AR VIEW</span>
                </Button>
                <Button
                  variant="outline"
                  className="text-center bg-[#2D3436] hover:bg-[#2D3436]/80 transition text-white font-['Righteous',_cursive] py-2 px-4 rounded-lg flex-1 flex items-center justify-center space-x-2"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-4 w-4" />
                  <span>ADD TO WISHLIST</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User-Generated Content */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-['Righteous',_cursive] text-3xl">SPOTTED IN THE WILD</h2>
            <p className="text-lg">#DinoKicks shared by our community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User photo"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1465479423260-c4afc24172c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User photo"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User photo"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="User photo"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="text-center mt-6">
            <a
              href="#"
              className="inline-flex items-center space-x-2 font-['Righteous',_cursive] text-[#FF5714] hover:text-[#008080] transition"
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>SHARE YOUR #DINOKICKS</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
