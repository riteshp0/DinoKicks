import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["/api/products/featured"],
  });

  // Create array of 4 skeletons for loading state
  const skeletons = Array(4).fill(0).map((_, index) => (
    <div key={index} className="min-w-[280px] md:min-w-[320px]">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <Skeleton className="h-64 w-full" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex space-x-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  ));

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-2">FEATURED KICKS</h2>
          <p className="text-lg">Our hottest dinosaur-inspired shoes fresh from extinction</p>
        </div>
        
        {error ? (
          <div className="text-center text-red-500">
            <p>Error loading featured products. Please try again later.</p>
          </div>
        ) : (
          <>
            {/* Featured Products Carousel */}
            <div className="flex overflow-x-auto pb-6 space-x-6 snap-x">
              {isLoading
                ? skeletons
                : products?.map((product) => (
                    <div key={product.id} className="snap-start min-w-[280px] md:min-w-[320px]">
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/products" className="inline-flex items-center space-x-2 font-['Righteous',_cursive] text-[#008080] hover:text-[#FF5714] transition text-lg">
                <span>VIEW ALL FEATURED KICKS</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
