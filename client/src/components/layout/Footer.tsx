import { Link } from "wouter";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2D3436] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#39FF14] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2D3436]" fill="currentColor">
                  <path d="M13.04 14.69l1.07-2.14 5.18-5.3-2.75-2.75-5.3 5.18-2.14 1.07 3.94 3.94z M20 6.5l3 3-3 3-3-3 3-3z M14.37 7.29l1.92-1.92a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0L11.5 4.5c-3 3-6 6-6 8.5a7 7 0 0 0 7 7c2.5 0 5.5-3 8.5-6l1.96-1.96a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0l-1.92 1.92-3.84-3.84z"/>
                </svg>
              </div>
              <span className="text-white font-['Righteous',_cursive] text-xl">DINO KICKS</span>
            </div>
            <p className="mb-4">Prehistoric kicks for modern feet. Bringing dinosaur-inspired style to sneaker lovers everywhere.</p>
            <p className="text-sm text-gray-400">© 2023 Dino Kicks. All rights reserved.</p>
          </div>
          
          <div>
            <h3 className="font-['Righteous',_cursive] text-lg mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="hover:text-[#39FF14] transition">All Products</Link></li>
              <li><Link href="/products?badge=NEW" className="hover:text-[#39FF14] transition">New Arrivals</Link></li>
              <li><Link href="/collections/raptor-series" className="hover:text-[#39FF14] transition">Raptor Series</Link></li>
              <li><Link href="/collections/t-rex-line" className="hover:text-[#39FF14] transition">T-Rex Line</Link></li>
              <li><Link href="/collections/kids" className="hover:text-[#39FF14] transition">Mini Dino Kicks</Link></li>
              <li><Link href="/products?badge=LIMITED" className="hover:text-[#39FF14] transition">Limited Editions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-['Righteous',_cursive] text-lg mb-4">HELP</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-[#39FF14] transition">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-[#39FF14] transition">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-[#39FF14] transition">FAQ</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#39FF14] transition">Size Guide</Link></li>
              <li><Link href="/tracking" className="hover:text-[#39FF14] transition">Track Order</Link></li>
              <li><Link href="/privacy" className="hover:text-[#39FF14] transition">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-['Righteous',_cursive] text-lg mb-4">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link href="/our-story" className="hover:text-[#39FF14] transition">Our Story</Link></li>
              <li><Link href="/dino-facts" className="hover:text-[#39FF14] transition">Dino Facts</Link></li>
              <li><Link href="/sustainability" className="hover:text-[#39FF14] transition">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-[#39FF14] transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-[#39FF14] transition">Press</Link></li>
              <li><Link href="/affiliate" className="hover:text-[#39FF14] transition">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex justify-center space-x-6">
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
      </div>
    </footer>
  );
};

export default Footer;
