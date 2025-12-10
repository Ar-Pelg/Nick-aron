import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const TracingLine = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 50 0 L 50 100"
          stroke="#E5E5E5" 
          strokeWidth="0.1"
          fill="none"
        />
        <motion.path
          d="M 50 0 L 50 100"
          stroke="#171717"
          strokeWidth="0.15"
          fill="none"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
};