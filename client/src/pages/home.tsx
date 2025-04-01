import { Helmet } from "react-helmet";
import HeroSection from "@/components/hero/HeroSection";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CollectionsSection from "@/components/collections/CollectionsSection";
import QuizSection from "@/components/quiz/QuizSection";
import CTASection from "@/components/cta/CTASection";
import { useEffect } from "react";

const Home = () => {
  // Set up session ID for cart functionality if it doesn't exist
  useEffect(() => {
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem("sessionId", Math.random().toString(36).substring(2, 15));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Dino Kicks | Prehistoric Kicks for Modern Feet</title>
        <meta name="description" content="Unleash your inner dinosaur with our exclusive collection of prehistoric-inspired sneakers. Dino Kicks - Prehistoric Kicks for Modern Feet." />
      </Helmet>

      <HeroSection />
      <FeaturedProducts />
      <CollectionsSection />
      <QuizSection />
      <CTASection />
    </>
  );
};

export default Home;
