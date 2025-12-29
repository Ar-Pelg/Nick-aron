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
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
            className="fixed inset-0 z-[100] bg-neutral-900 flex flex-col items-center justify-center text-white"
        >
            <div className="absolute top-12 left-12 overflow-hidden h-6">
                <motion.div
                    animate={{ y: [0, -24, -48, -72, -96] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[10px] uppercase tracking-[0.5em] text-neutral-500"
                >
                    {words.map((w) => <div key={w} className="h-6">{w}</div>)}
                </motion.div>
            </div>

            <div className="relative">
                <motion.span
                    className="text-[20vw] font-serif leading-none tabular-nums"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {counter}
                </motion.span>
                <span className="text-xl font-serif absolute -top-4 -right-8 opacity-40">%</span>
            </div>

            <div className="absolute bottom-12 w-full max-w-xs px-12">
                <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${counter}%` }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
