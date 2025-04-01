import { Link } from "wouter";
import { motion } from "framer-motion";

interface CollectionCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  path: string;
  bgColor: string;
  buttonColor: string;
  buttonTextColor: string;
  tagBgColor: string;
}

const CollectionCard = ({
  title,
  description,
  imageUrl,
  tags,
  path,
  bgColor,
  buttonColor,
  buttonTextColor,
  tagBgColor,
}: CollectionCardProps) => {
  return (
    <motion.div
      className={`${bgColor} rounded-xl overflow-hidden group cursor-pointer relative`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
      />
      <div className="p-6 relative z-10 text-center">
        <h3 className="font-['Righteous',_cursive] text-2xl mb-2 text-white">{title}</h3>
        <p className="mb-4 text-white">{description}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag, index) => (
            <span key={index} className={`${tagBgColor} px-3 py-1 rounded-full text-sm text-white`}>
              {tag}
            </span>
          ))}
        </div>
        <Link href={path}>
          <button className={`mt-4 font-['Righteous',_cursive] py-2 px-6 ${buttonColor} hover:opacity-80 transition rounded-lg ${buttonTextColor}`}>
            EXPLORE
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

const CollectionsSection = () => {
  const collections = [
    {
      title: "BY DINOSAUR",
      description: "Shop by your favorite prehistoric beasts",
      imageUrl: "https://images.unsplash.com/photo-1608237957815-e3a5cdeaa90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["Raptor Series", "T-Rex Line", "Brontosaurus Basics"],
      path: "/collections",
      bgColor: "bg-[#FF5714]/20",
      buttonColor: "bg-[#FF5714]",
      buttonTextColor: "text-white",
      tagBgColor: "bg-[#39FF14]/20"
    },
    {
      title: "BY STYLE",
      description: "Find the perfect kicks for every occasion",
      imageUrl: "https://images.unsplash.com/photo-1626947346165-c2de974c2f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw1fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["Running", "Casual", "Limited Fossils"],
      path: "/categories/running",
      bgColor: "bg-[#39FF14]/20",
      buttonColor: "bg-[#39FF14]",
      buttonTextColor: "text-[#2D3436]",
      tagBgColor: "bg-[#FF5714]/20"
    },
    {
      title: "MINI DINO KICKS",
      description: "Perfect prehistoric fun for little explorers",
      imageUrl: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw2fHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080",
      tags: ["Toddler", "Kids", "Youth"],
      path: "/collections/kids",
      bgColor: "bg-[#008080]/20",
      buttonColor: "bg-[#008080]",
      buttonTextColor: "text-white",
      tagBgColor: "bg-[#008080]/40"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#2D3436] to-[#008080] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-2">COLLECTIONS</h2>
          <p className="text-lg">Explore our prehistoric shoe categories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <CollectionCard key={index} {...collection} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
