import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    const [counter, setCounter] = useState(0);
    const [currentWord, setCurrentWord] = useState("Concept");

    const words = [
        { text: "Concept", trigger: 0 },
        { text: "Strategy", trigger: 25 },
        { text: "Design", trigger: 50 },
        { text: "Development", trigger: 75 },
        { text: "Experience", trigger: 90 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                const next = prev + 1;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }

                // Update word based on progress
                const foundWord = [...words].reverse().find(w => next >= w.trigger);
                if (foundWord) setCurrentWord(foundWord.text);

                return next;
            });
        }, 30);
        return () => clearInterval(timer);
    }, [onComplete]);

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
                <div className="overflow-hidden h-8 mb-8">
                    <motion.div
                        key={currentWord}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-xs uppercase tracking-[0.5em] text-neutral-500 text-center font-bold"
                    >
                        {currentWord}
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
                </div>
            </motion.div>
        </motion.div>
    );
};
