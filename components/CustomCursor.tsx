import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  // Use MotionValues to track mouse position without triggering React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const [isHovering, setIsHovering] = useState(false);

  // Smooth out the mouse movement
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      // Update motion values directly
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      // Check if the target or any of its parents are interactive
      const isClickable = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         target.closest('a') !== null || 
                         target.closest('button') !== null ||
                         target.classList.contains('cursor-pointer') ||
                         target.closest('.cursor-pointer') !== null ||
                         target.getAttribute('data-cursor') !== null;
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, [mouseX, mouseY]);

  // Variants only control size and appearance, not position
  const variants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "white",
      mixBlendMode: "difference" as const
    },
    hover: {
      width: 80,
      height: 80,
      backgroundColor: "white",
      mixBlendMode: "difference" as const
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%"
      }}
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
};