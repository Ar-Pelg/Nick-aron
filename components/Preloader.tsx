import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 5) + 1;
            });
        }, 40);
        return () => clearInterval(timer);
    }, [onComplete]);

    const words = ["VISIE", "AMBACHT", "ARCHITECTUUR", "DIGITAAL", "ATELIER"];

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col pointer-events-none"
            initial="initial"
            exit="exit"
        >
            {/* Top Curtain */}
            <motion.div
                className="relative w-full h-1/2 bg-[#161617] flex items-end justify-center pb-2 border-b border-white/10"
                initial={{ y: 0 }}
                exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            >
                <div className="overflow-hidden h-6 mb-8">
                    <motion.div
                        animate={{ y: [0, -24, -48, -72, -96] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 text-center"
                    >
                        {words.map((w) => <div key={w} className="h-6">{w}</div>)}
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Curtain */}
            <motion.div
                className="relative w-full h-1/2 bg-[#161617] flex items-start justify-center pt-2 border-t border-white/10"
                initial={{ y: 0 }}
                exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            >
                <div className="relative mt-8">
                    <motion.span
                        className="text-[10vw] font-serif leading-none tabular-nums text-white"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {counter}
                    </motion.span>
                    <div className="absolute top-full left-0 w-full h-[1px] bg-white/10 mt-4 overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-white"
                            style={{ width: `${counter}%` }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
