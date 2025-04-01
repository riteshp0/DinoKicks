import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  const handleAddToCart = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId") || "";
      
      await apiRequest("POST", "/api/cart/items", {
        productId: product.id,
        quantity: 1,
        color: selectedColor,
        size: product.sizes[0]
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition relative">
        {product.badge && (
          <div className={`
            absolute top-3 right-3 z-10 
            ${product.badge === 'HOT!' ? 'bg-[#FF5714]' : ''}
            ${product.badge === 'NEW' ? 'bg-[#008080]' : ''}
            ${product.badge === 'LIMITED' ? 'bg-purple-600' : ''}
            text-white text-sm font-bold py-1 px-3 rounded-full
          `}>
            {product.badge}
          </div>
        )}
        
        <Link href={`/product/${product.id}`}>
          <div className="h-64 overflow-hidden">
            <img 
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300" 
              src={product.imageUrl} 
              alt={product.name}
            />
          </div>
        </Link>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-['Righteous',_cursive] text-lg hover:text-[#FF5714] transition">
                {product.name}
              </h3>
            </Link>
            <span className="font-bold text-[#FF5714]">${product.price.toFixed(2)}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex space-x-2 mb-4">
            {product.colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${
                  color === selectedColor ? 'border-[#2D3436]' : 'border-transparent hover:border-[#2D3436]'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
          
          <Button 
            className="w-full py-2 bg-[#2D3436] text-white font-['Righteous',_cursive] rounded-lg hover:bg-[#39FF14] hover:text-[#2D3436] transition flex items-center justify-center space-x-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>ADD TO CART</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
