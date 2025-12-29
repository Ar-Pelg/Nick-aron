import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Crosshair, Zap } from 'lucide-react';

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

const COMPETITORS = [
    "WORDPRESS_V5",
    "SLOME_WIX_THEME",
    "GOEDKOPE_TEMPLATE",
    "SPAGHETTI_CODE",
    "TRAGE_PLUGINS",
    "ELEMENTOR_BLOAT",
    "GENERIC_THEME",
    "SQUASHED_UI"
];

export const LabGame: React.FC<LabGameProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("SYSTEEM GEREED VOOR OPSCHONING...");

    useEffect(() => {
        if (step === 2) {
            setMessage("TARGETS GEÏDENTIFICEERD. SCHIET ZE AF.");

            const interval = setInterval(() => {
                if (enemies.length < 5) {
                    const newEnemy: Enemy = {
                        id: Date.now() + Math.random(),
                        name: COMPETITORS[Math.floor(Math.random() * COMPETITORS.length)],
                        x: 15 + Math.random() * 70,
                        y: 15 + Math.random() * 70
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
                            setMessage("TE LAAT. HET INTERNET SLIBT DICHT.");
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

        const responses = ["ELIMINATIE VOLTOOID", "CODE GEZUIVERD", "GOEDKOOP WEG", "DOELWIT GERAAKT", "WORDPRESS CRASHED"];
        setMessage(responses[Math.floor(Math.random() * responses.length)]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-neutral-950 text-white font-mono flex flex-col items-center justify-center overflow-hidden cursor-none"
        >
            <CustomLabCursor />

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Interface Top */}
            <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-50">
                <div className="space-y-1">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Protocol: DIGITAL_PURGE</div>
                    <div className={`text-xs font-bold ${isError ? 'text-red-500' : 'text-amber-500'}`}>
                        {isError ? 'STATUS: KRITIEK' : 'STATUS: OPERATIONEEL'}
                    </div>
                </div>

                {step === 2 && (
                    <div className="flex gap-12 text-right">
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Tijd</div>
                            <div className="text-2xl font-bold">{timeLeft}s</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Eliminaties</div>
                            <div className="text-2xl text-amber-500 font-bold">{score}/10</div>
                        </div>
                    </div>
                )}

                <button onClick={onClose} className="text-[10px] uppercase tracking-[0.3em] hover:text-red-500 transition-colors cursor-pointer px-4 py-2 border border-white/10">Afsluiten</button>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center max-w-xl px-8"
                        >
                            <div className="mb-8 flex justify-center">
                                <ShieldAlert size={80} className="text-amber-500" />
                            </div>
                            <h2 className="text-3xl tracking-tighter font-bold mb-4 uppercase">Schoon het internet op</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-12">
                                Trage templates en rommelige code van concurrenten vervuilen het web.
                                Het is tijd om de standaard te herstellen.
                                <br /><br />
                                <span className="text-white font-bold">OPDRACHT:</span> Schiet <span className="text-amber-500">10 targets</span> af binnen <span className="text-amber-500">15 seconden</span>.
                            </p>
                            <button
                                onClick={() => setStep(2)}
                                className="px-12 py-5 bg-white text-black hover:bg-amber-500 transition-all uppercase text-xs tracking-widest font-black cursor-pointer flex items-center gap-3 mx-auto"
                            >
                                <Zap size={16} /> START OPSCHONING
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            {enemies.map((enemy) => (
                                <motion.div
                                    key={enemy.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, x: `${enemy.x}vw`, y: `${enemy.y}vh` }}
                                    exit={{ opacity: 0, scale: 2, filter: 'blur(15px)' }}
                                    onClick={() => handleEnemyClick(enemy.id)}
                                    className="absolute group flex flex-col items-center justify-center cursor-crosshair"
                                >
                                    {/* Shooting Target Design */}
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <div className="absolute inset-0 border-4 border-red-600/30 rounded-full group-hover:border-amber-500 transition-all" />
                                        <div className="absolute inset-4 border-2 border-red-600/50 rounded-full" />
                                        <div className="absolute inset-7 border border-red-600 rounded-full" />
                                        <div className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-amber-500" />

                                        {/* Crosshair lines */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/20" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/20" />
                                    </div>

                                    <div className="mt-3 px-2 py-1 bg-black/80 border border-white/20 text-[10px] font-bold tracking-tight text-white group-hover:text-amber-500">
                                        {enemy.name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 flex flex-col items-center text-center px-6"
                        >
                            <CheckCircle2 size={80} className="text-emerald-500" />
                            <div className="space-y-4">
                                <h2 className="font-serif text-5xl italic text-white tracking-tight">Vervuiling Verholpen.</h2>
                                <p className="text-neutral-400 text-sm uppercase max-w-md mx-auto">
                                    Het internet is weer een stukje mooier. <br />
                                    De digitale balans is hersteld.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-12 py-4 bg-emerald-500 text-black text-xs tracking-[0.3em] uppercase font-black hover:bg-white transition-colors cursor-pointer"
                            >
                                TERUG NAAR HET ATELIER
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold italic">
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
            <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 border border-amber-500/50 rounded-full" />
                <Crosshair size={20} className="text-amber-500" />
                <div className="absolute top-1/2 left-[-20px] w-4 h-[1px] bg-amber-500/50" />
                <div className="absolute top-1/2 right-[-20px] w-4 h-[1px] bg-amber-500/50" />
                <div className="absolute top-[-20px] left-1/2 w-[1px] h-4 bg-amber-500/50" />
                <div className="absolute bottom-[-20px] left-1/2 w-[1px] h-4 bg-amber-500/50" />
            </div>
        </div>
    );
};
