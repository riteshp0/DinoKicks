import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "../cart/CartDrawer";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location] = useLocation();

  // Get cart items count
  const { data: cartData } = useQuery({
    queryKey: ["/api/cart"],
    staleTime: 0,
  });

  const cartItemsCount = cartData?.items?.length || 0;

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="bg-[#2D3436] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-[#39FF14] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2D3436]" fill="currentColor">
                  <path d="M13.04 14.69l1.07-2.14 5.18-5.3-2.75-2.75-5.3 5.18-2.14 1.07 3.94 3.94z M20 6.5l3 3-3 3-3-3 3-3z M14.37 7.29l1.92-1.92a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0L11.5 4.5c-3 3-6 6-6 8.5a7 7 0 0 0 7 7c2.5 0 5.5-3 8.5-6l1.96-1.96a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0l-1.92 1.92-3.84-3.84z"/>
                </svg>
              </div>
              <span className="text-white font-['Righteous',_cursive] text-2xl md:text-3xl">DINO KICKS</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/collections" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive]">
                Collections
              </Link>
              <Link href="/products" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive]">
                Shop
              </Link>
              <Link href="/collections/herbivore-collection" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive]">
                Our Story
              </Link>
              <Link href="/collections" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive]">
                Dino Facts
              </Link>
            </nav>
            
            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#39FF14] hover:bg-transparent">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-white hover:text-[#39FF14] hover:bg-transparent">
                <User className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-[#39FF14] hover:bg-transparent relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5714] text-white text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-[#39FF14] hover:bg-transparent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#2D3436] md:hidden pt-20 px-4">
          <nav className="flex flex-col space-y-6 items-center">
            <Link href="/collections" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive] text-xl">
              Collections
            </Link>
            <Link href="/products" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive] text-xl">
              Shop
            </Link>
            <Link href="/collections/herbivore-collection" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive] text-xl">
              Our Story
            </Link>
            <Link href="/collections" className="text-white hover:text-[#39FF14] transition font-['Righteous',_cursive] text-xl">
              Dino Facts
            </Link>
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
