import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedPigeon = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute top-[-100px] right-0 md:right-20 w-48 h-48 md:w-64 md:h-64 pointer-events-none text-neutral-500 opacity-30 mix-blend-difference z-0"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <g transform="translate(100, 100)">
           <motion.g
             animate={{ y: [-10, 10, -10], rotate: [0, 2, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           >
              <motion.path d="M -40,10 L -80,-40 L -20,-10 Z" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
              <motion.path d="M -50,20 L 50,-10 L 70,0 L 50,30 Z" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }} />
              <motion.path d="M -40,10 L -10,-60 L 30,-10 Z" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.2 }} />
              <motion.path d="M -50,20 L -80,30 L -60,15" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8 }} />
           </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};