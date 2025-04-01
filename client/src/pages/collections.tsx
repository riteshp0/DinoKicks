import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

const collectionsData = {
  "raptor-series": {
    title: "Raptor Series",
    description: "Speed and agility inspired by the fastest dinosaurs ever known.",
    bgImage: "https://images.unsplash.com/photo-1608237957815-e3a5cdeaa90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#FF5714]"
  },
  "t-rex-line": {
    title: "T-Rex Line",
    description: "Dominate the urban jungle with these fierce T-Rex inspired kicks.",
    bgImage: "https://images.unsplash.com/photo-1595829227996-c1c1cccb4c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#2D3436]"
  },
  "herbivore-collection": {
    title: "Herbivore Collection",
    description: "Classic comfort with stability and support inspired by gentle giants.",
    bgImage: "https://images.unsplash.com/photo-1593001930968-a2dd52704fa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#008080]"
  },
  "flying-dinosaurs": {
    title: "Flying Dinosaurs",
    description: "Lightweight shoes designed for maximum speed and minimal weight.",
    bgImage: "https://images.unsplash.com/photo-1626947346165-c2de974c2f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw1fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#39FF14]"
  },
  "jurassic-collection": {
    title: "Jurassic Collection",
    description: "Our premium lineup featuring the most iconic dinosaur-inspired designs.",
    bgImage: "https://images.unsplash.com/photo-1610495527260-c0ea73f732f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-gradient-to-r from-[#FF5714] to-[#39FF14]"
  },
  "kids": {
    title: "Mini Dino Kicks",
    description: "Perfect prehistoric fun for little explorers.",
    bgImage: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw2fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#39FF14]"
  }
};

const Collections = () => {
  const { collection } = useParams();
  
  // If no specific collection is selected, show all collections
  if (!collection) {
    return <CollectionsList />;
  }

  // If collection is selected, show products for that collection
  return <CollectionDetail collectionSlug={collection} />;
};

const CollectionsList = () => {
  return (
    <>
      <Helmet>
        <title>Collections | Dino Kicks</title>
        <meta name="description" content="Explore our prehistoric shoe categories at Dino Kicks - from fierce predators to gentle giants." />
      </Helmet>

      <div className="bg-gradient-to-r from-[#2D3436] to-[#008080] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="font-['Righteous',_cursive] text-3xl md:text-5xl text-white text-center">
            Collections
          </h1>
          <p className="text-white text-center mt-2 max-w-2xl mx-auto">
            Explore our prehistoric shoe categories - each inspired by different dinosaur species and traits
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(collectionsData).map(([slug, data]) => (
            <Link key={slug} href={`/collections/${slug}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer group">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>
                  <img 
                    src={data.bgImage} 
                    alt={data.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="font-['Righteous',_cursive] text-3xl text-white text-center">
                      {data.title}
                    </h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{data.description}</p>
                  <Button 
                    className={`w-full ${data.color.includes('gradient') ? data.color : data.color} text-white font-['Righteous',_cursive] py-2 rounded-lg transition flex items-center justify-center space-x-2`}
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

const CollectionDetail = ({ collectionSlug }: { collectionSlug: string }) => {
  const collectionInfo = collectionsData[collectionSlug as keyof typeof collectionsData] || {
    title: "Collection",
    description: "Explore our dinosaur-inspired shoes",
    bgImage: "https://images.unsplash.com/photo-1595829227996-c1c1cccb4c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    color: "bg-[#2D3436]"
  };

  // Get products for this collection
  const { data: products, isLoading, error } = useQuery({
    queryKey: [`/api/collections/${collectionSlug.replace(/-/g, ' ')}`],
  });

  // Create array of skeletons for loading state
  const skeletonCards = Array(4).fill(0).map((_, index) => (
    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
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
  ));

  return (
    <>
      <Helmet>
        <title>{collectionInfo.title} | Dino Kicks</title>
        <meta name="description" content={collectionInfo.description} />
      </Helmet>

      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${collectionInfo.bgImage})` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="font-['Righteous',_cursive] text-4xl md:text-5xl text-white text-center mb-4">
            {collectionInfo.title}
          </h1>
          <p className="text-white text-center max-w-2xl">
            {collectionInfo.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Collection</h2>
            <p className="mb-6">Sorry, we couldn't load the products for this collection.</p>
            <Button asChild>
              <Link href="/collections">View All Collections</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skeletonCards}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
            <p className="mb-6">This collection doesn't have any products yet.</p>
            <Button asChild>
              <Link href="/collections">View All Collections</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Collections;
