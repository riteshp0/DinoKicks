import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FootprintAnimation from "@/lib/footprint-animation";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1619096113437-4be930198d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxyZXRyby1mdXR1cmlzdGljJTIwYmFja2dyb3VuZHN8ZW58MHx8fHwxNjk3NTI0MDMzfDA&ixlib=rb-4.0.3&q=80&w=1080')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D3436]/80 to-[#008080]/50"></div>
      </div>
      
      {/* Animated footprints */}
      <FootprintAnimation />
      
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-xl">
          <motion.h1 
            className="font-['Righteous',_cursive] text-4xl md:text-6xl text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            PREHISTORIC KICKS FOR MODERN FEET
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-[#F5F5F5] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Unleash your inner dinosaur with our exclusive collection of prehistoric-inspired sneakers.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              asChild
              size="lg"
              className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-[#2D3436] font-bold font-['Righteous',_cursive]"
            >
              <Link href="/collections/jurassic-collection" className="inline-flex items-center space-x-2">
                <span>EXPLORE THE JURASSIC COLLECTION</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg"
              className="bg-[#FF5714] hover:bg-[#FF5714]/80 text-white font-bold font-['Righteous',_cursive]"
            >
              <Link href="/products">
                SHOP NOW
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
