import { forwardRef } from "react";
import { motion, MotionProps, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type CardHoverProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  whileHoverScale?: number;
  whileHoverY?: number;
  transitionDuration?: number;
};

const CardHover = forwardRef<HTMLDivElement, CardHoverProps>(
  ({ 
    children, 
    className, 
    whileHoverScale = 1.02, 
    whileHoverY = -5,
    transitionDuration = 0.2,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("group cursor-pointer", className)}
        whileHover={{ 
          scale: whileHoverScale, 
          y: whileHoverY,
        }}
        transition={{ 
          duration: transitionDuration,
          ease: "easeInOut",
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardHover.displayName = "CardHover";

export { CardHover };
