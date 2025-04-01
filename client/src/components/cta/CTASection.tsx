import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Facebook, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success!",
      description: "You've joined the Dino Rewards Club!",
    });
    
    setEmail("");
  };

  return (
    <section 
      className="py-16 bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597245491440-bb638582209c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxyZXRyby1mdXR1cmlzdGljJTIwYmFja2dyb3VuZHN8ZW58MHx8fHwxNjk3NTI0MDMzfDA&ixlib=rb-4.0.3&q=80&w=1080')" }}
    >
      <div className="absolute inset-0 bg-[#2D3436]/80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-4">JOIN THE DINO REWARDS CLUB</h2>
            <p className="mb-6">Collect fossils (points) with every purchase and unlock exclusive prehistoric perks!</p>
            
            <form className="mb-6" onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 py-3 px-4 rounded-l-lg focus:outline-none text-[#2D3436] border-0"
                />
                <Button 
                  type="submit" 
                  className="bg-[#39FF14] hover:bg-[#39FF14]/80 text-[#2D3436] font-['Righteous',_cursive] py-3 px-6 rounded-r-lg transition"
                >
                  JOIN
                </Button>
              </div>
            </form>
            
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-white hover:text-[#39FF14] transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[#39FF14] transition">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[#39FF14] transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[#39FF14] transition">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
