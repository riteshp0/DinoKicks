import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Footprint {
  id: string;
  x: number;
  delay: number;
}

const FootprintAnimation = () => {
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Generate footprints when component mounts
  useEffect(() => {
    const updateContainerWidth = () => {
      setContainerWidth(window.innerWidth);
    };

    // Initial width measurement
    updateContainerWidth();

    // Set up window resize listener
    window.addEventListener("resize", updateContainerWidth);

    // Generate initial footprints
    const initialFootprints = Array.from({ length: 3 }, (_, i) => ({
      id: `footprint-${i}`,
      x: Math.random() * 0.8, // Random position along the bottom
      delay: i * 1.5 // Staggered animation
    }));
    
    setFootprints(initialFootprints);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  // Regenerate footprints on animation complete
  const handleAnimationComplete = (id: string) => {
    setFootprints(prev => {
      const newFootprints = prev.filter(fp => fp.id !== id);
      const newFootprint = {
        id: `footprint-${Date.now()}`,
        x: Math.random() * 0.8,
        delay: 0
      };
      return [...newFootprints, newFootprint];
    });
  };

  return (
    <div className="absolute bottom-28 left-0 right-0 h-20 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {footprints.map(footprint => (
          <motion.div
            key={footprint.id}
            className="absolute bottom-0"
            style={{ left: `${footprint.x * 100}%` }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: containerWidth + 100, 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ 
              duration: 8, 
              delay: footprint.delay,
              ease: "linear" 
            }}
            onAnimationComplete={() => handleAnimationComplete(footprint.id)}
          >
            <div className="flex space-x-16">
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 24 24" 
                fill="rgba(255, 255, 255, 0.2)"
                className="h-16 w-auto"
              >
                <path d="M10.42 9.88c.164.38-.868 1.409-.483 1.643.385.235 3.46-.512 3.54.172.08.684-2.397 1.328-2.866 1.95-.47.62.288 1.047.342 1.457.053.41-1.005-.386-1.55-.03-.553.357.28.965.097 1.456-.184.491-1.082.471-1.549.816-.467.344.32 1.175.042 1.51-.234.282-1.602-.132-1.932.287-.443.561.52.97-.004 1.376-.497.387-1.454-.338-2.103.038-.436.252-1.77-.869-2.058-.752-.13.052-.554.738-.724.853-.17.115-.866-.685-1.05-.584-.74.407 1.229 2.352.233 2.483-.513.068-2.177-1.013-2.564-.57-.387.443 1.213 1.328.867 1.775-.346.446-1.908.068-2.237.537-.33.468 1.235 1.25.945 1.732-.345.574-2.317-.42-2.515.071-.197.491 1.7.887 1.548 1.392-.153.506-2.105.336-2.211.856-.106.52 1.862.906 1.802 1.436-.06.53-2.006.577-2.02 1.113-.012.536 2.05.83 2.082 1.37.033.539-1.964.764-1.885 1.303.078.54 2.2.711 2.323 1.243.123.533-1.873.93-1.704 1.45.16.516 1.817.233 1.865.728.05.526.172 1.279.42 1.773.378.749 5.714-2.489 6.142-2.493a5.756 5.756 0 0 0 2.455-.5c.473-.216.713-.354 1.304-.424s2.357-.19 2.93-.723c.574-.533-.048-2.269.65-2.591.7-.323 2.29.748 2.862.18.571-.567-.478-2.345.068-2.719.547-.373 2.302.734 2.606.23.304-.503-.768-1.894-.578-2.487.19-.594 1.991.075 2.058-.573.068-.647-1.535-1.376-1.592-2.052-.057-.675 1.552-.558 1.367-1.248-.186-.69-1.935-.681-2.25-1.39-.313-.71 1.08-1.164.642-1.891-.437-.728-2.049.018-2.614-.729-.566-.746.637-1.824.008-2.569-.543-.64-1.859.482-2.462-.103-.362-.35-3.914 7.278-4.113 7.273-.201-.005-1.216-4.06-1.053-3.683z" />
              </svg>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FootprintAnimation;
