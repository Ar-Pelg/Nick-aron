import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from './Button';

interface LabGameProps {
    onClose: () => void;
    onComplete: () => void;
}

interface Enemy {
    id: number;
    name: string;
    x: number;
    y: number;
}

// More "clean" technical terms for clutter
const COMPETITORS = [
    "Legacy Code",
    "Unused CSS",
    "Heavy Script",
    "Render Block",
    "Bloatware",
    "Duplicate",
    "Layout Shift",
    "Memory Leak"
];

export const LabGame: React.FC<LabGameProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("Systeem gereed.");

    useEffect(() => {
        if (step === 2) {
            setMessage("Verwijder de ruis.");

            const interval = setInterval(() => {
                if (enemies.length < 5) {
                    const newEnemy: Enemy = {
                        id: Date.now() + Math.random(),
                        name: COMPETITORS[Math.floor(Math.random() * COMPETITORS.length)],
                        x: 20 + Math.random() * 60,
                        y: 20 + Math.random() * 60
                    };
                    setEnemies(prev => [...prev, newEnemy]);
                }
            }, 800);

            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        clearInterval(interval);
                        if (score < 10) {
                            setIsError(true);
                            setMessage("Optimalisatie mislukt.");
                            setTimeout(() => {
                                setStep(1);
                                setScore(0);
                                setTimeLeft(15);
                                setIsError(false);
                                setEnemies([]);
                            }, 2500);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(interval);
                clearInterval(timer);
            };
        }
    }, [step, enemies.length, score]);

    const handleEnemyClick = (id: number) => {
        setEnemies(prev => prev.filter(e => e.id !== id));
        setScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 10) {
                setStep(3);
                onComplete();
            }
            return newScore;
        });

        const responses = ["Opgeschoond", "Geoptimaliseerd", "Verwijderd", "Clean", "Sneller"];
        setMessage(responses[Math.floor(Math.random() * responses.length)]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-neutral-900 text-white flex flex-col items-center justify-center overflow-hidden cursor-none"
        >
            <CustomLabCursor />

            {/* Subtle Texture Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Interface Top */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-50">
                <div className="space-y-1">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Reset Protocol</div>
                    <div className={`text-xs tracking-widest uppercase ${isError ? 'text-red-500' : 'text-neutral-300'}`}>
                        {isError ? 'Kritieke Fout' : 'Standby'}
                    </div>
                </div>

                {step === 2 && (
                    <div className="flex gap-16 text-right">
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Tijd</div>
                            <div className="text-xl font-serif">{timeLeft}s</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Status</div>
                            <div className="text-xl font-serif">{score}/10</div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center max-w-xl px-8"
                        >
                            <h2 className="text-5xl md:text-7xl font-serif mb-6 text-white">Digitale Ruis</h2>
                            <p className="text-neutral-400 text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
                                Het web is vervuild met onnodige code en trage elementen.
                                Breng de essentie terug.
                            </p>

                            <div
                                onClick={() => setStep(2)}
                                className="inline-block"
                            >
                                <Button variant="white">Start Opschoning</Button>
                            </div>

                            <p className="mt-8 text-neutral-600 text-xs uppercase tracking-widest">
                                Doel: 10 items &middot; Tijd: 15s
                            </p>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            {enemies.map((enemy) => (
                                <motion.div
                                    key={enemy.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1, x: `${enemy.x}vw`, y: `${enemy.y}vh` }}
                                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                    onClick={() => handleEnemyClick(enemy.id)}
                                    className="absolute group cursor-pointer"
                                >
                                    {/* Abstract Glitch Target */}
                                    <div className="relative flex items-center justify-center">
                                        <div className="relative px-4 py-2 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 text-neutral-300 text-xs uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors duration-300">
                                            {enemy.name}
                                        </div>
                                        {/* Minimal indicators */}
                                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 flex flex-col items-center text-center px-6"
                        >
                            <div className="w-20 h-20 rounded-full border border-neutral-700 flex items-center justify-center text-white mb-4">
                                <Check size={32} />
                            </div>

                            <div className="space-y-4">
                                <h2 className="font-serif text-5xl md:text-6xl text-white">Balans Hersteld.</h2>
                                <p className="text-neutral-400 text-lg font-light max-w-md mx-auto">
                                    Less is more. De digitale ruimte is weer schoon.
                                </p>
                            </div>

                            <div className="pt-8" onClick={onClose}>
                                <Button variant="secondary">Terug naar Homepage</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                {message}
            </div>
        </motion.div>
    );
};

const CustomLabCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div
            className="fixed pointer-events-none z-[300] mix-blend-difference"
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
        >
            <div className="w-4 h-4 rounded-full border border-white bg-white/20" />
        </div>
    );
};
