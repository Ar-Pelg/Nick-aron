import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Layers } from 'lucide-react';
import { Button } from './Button';

interface LabGameProps {
    onClose: () => void;
    onComplete: () => void;
}

// Configurations
const GAME_WIDTH = 300;
const BLOCK_HEIGHT = 40;
const INITIAL_WIDTH = 200;
const TARGET_STACK = 8;
const ANIMATION_SPEED_BASE = 1.5; // Seconds per pass (decreases per level)

type Block = {
    id: number;
    width: number;
    x: number; // Center position relative to game container center
    color: string;
    label?: string;
};

const LABELS = [
    "Fundering",
    "Strategie",
    "UX Design",
    "Interactie",
    "Frontend",
    "Animatie",
    "Performance",
    "Launch"
];

export const LabGame: React.FC<LabGameProps> = ({ onClose, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
    const [stack, setStack] = useState<Block[]>([]);
    const [currentBlock, setCurrentBlock] = useState<{ width: number; x: number; direction: 1 | -1 }>({
        width: INITIAL_WIDTH,
        x: 0,
        direction: 1
    });
    const [level, setLevel] = useState(0);

    // Animation Ref
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const speedRef = useRef(ANIMATION_SPEED_BASE);

    // --- Game Logic ---

    const startGame = () => {
        setStack([]);
        setLevel(0);
        setCurrentBlock({ width: INITIAL_WIDTH, x: 0, direction: 1 });
        setGameState('playing');
        speedRef.current = ANIMATION_SPEED_BASE;
    };

    const animate = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        if (!startTimeRef.current) startTimeRef.current = time;
        const deltaTime = (time - startTimeRef.current) / 1000;

        // Calculate position based on sine wave for smooth back-and-forth
        // Range: -150 to +150 (approx, constrained by game width)
        const range = (GAME_WIDTH - currentBlock.width) / 2 + 50; // Add a bit of overshoot risk
        const speed = speedRef.current;

        // Use sine for smooth movement: -1 to 1
        // We accumulate time to move
        const t = time * 0.002 / speed;
        const newX = Math.sin(t) * range * 1.5; // 1.5 multiplier makes it go wider than the container occasionally

        setCurrentBlock(prev => ({ ...prev, x: newX }));
        requestRef.current = requestAnimationFrame(animate);
    }, [gameState, currentBlock.width]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, animate]);

    const handlePlaceBlock = () => {
        if (gameState !== 'playing') return;

        const prevBlock = stack.length > 0 ? stack[stack.length - 1] : { width: INITIAL_WIDTH + 40, x: 0 }; // Virtual base
        const currentX = currentBlock.x;
        const currentW = currentBlock.width;

        // Calculate Overlap
        // Check edges
        const currentLeft = currentX - currentW / 2;
        const currentRight = currentX + currentW / 2;
        const prevLeft = prevBlock.x - prevBlock.width / 2;
        const prevRight = prevBlock.x + prevBlock.width / 2;

        const overlapLeft = Math.max(currentLeft, prevLeft);
        const overlapRight = Math.min(currentRight, prevRight);
        const overlapWidth = overlapRight - overlapLeft;

        if (overlapWidth <= 0) {
            // Missed completely
            setGameState('lost');
        } else {
            // Hit!
            const newWidth = overlapWidth;
            const newX = overlapLeft + newWidth / 2;

            const newBlock: Block = {
                id: level,
                width: newWidth,
                x: newX,
                color: level === TARGET_STACK - 1 ? '#10b981' : 'white', // Green top
                label: LABELS[level] || `Laag ${level + 1}`
            };

            const newStack = [...stack, newBlock];
            setStack(newStack);

            if (newStack.length >= TARGET_STACK) {
                setGameState('won');
                onComplete();
            } else {
                // Next Level
                setLevel(prev => prev + 1);
                setCurrentBlock({
                    width: newWidth, // Keep the sliced width
                    x: 0, // Reset position logic handles starting point, but visual update happens in loop
                    direction: 1
                });
                // Slight speed increase
                speedRef.current = Math.max(0.5, speedRef.current * 0.9);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-neutral-900 text-white flex flex-col items-center justify-center font-sans"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Header / UI */}
            <div className="absolute top-8 w-full px-8 flex justify-between items-start z-20">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Project: The Tower</div>
                    <div className="text-xl font-serif text-white">
                        {gameState === 'playing' ? `Laag ${level + 1} / ${TARGET_STACK}` : 'Architectural Precision'}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Game Container */}
            <div className="relative z-10 w-full max-w-lg h-[600px] flex flex-col items-center justify-center select-none"
                onClick={handlePlaceBlock} // Tap anywhere to play
            >
                {gameState === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center p-8 bg-neutral-900/90 backdrop-blur border border-white/10 max-w-md"
                    >
                        <Layers size={48} className="mx-auto mb-6 text-neutral-300" />
                        <h2 className="text-4xl font-serif mb-4">De Architect</h2>
                        <p className="text-neutral-400 mb-8 leading-relaxed">
                            Bouw een stabiele fundering voor uw digitale product.
                            Stapel de lagen perfect op elkaar om de visie te realiseren.
                            <br /><br />
                            <span className="text-sm uppercase tracking-widest text-neutral-500">Klik om te plaatsen</span>
                        </p>
                        <div onClick={(e) => { e.stopPropagation(); startGame(); }} className="inline-block">
                            <Button variant="white">Start Bouwen</Button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <div className="relative w-[300px] h-[400px] border-b border-white/20 flex flex-col-reverse items-center overflow-hidden">
                        {/* Base Line */}
                        <div className="absolute bottom-0 w-full h-[1px] bg-white/50" />

                        {/* Stacked Blocks */}
                        {stack.map((block, i) => (
                            <motion.div
                                key={block.id}
                                layoutId={`block-${block.id}`}
                                className="h-[40px] border border-neutral-900/50 flex items-center justify-center text-[10px] uppercase tracking-wider font-medium text-black relative"
                                style={{
                                    width: block.width,
                                    // blocks are centered in the container, x is deviation from center
                                    marginLeft: block.x * 2, // x is center offset, margin pushes it roughly? No, let's use translate
                                    transform: `translateX(${block.x}px)`,
                                    backgroundColor: block.color === 'white' ? '#e5e5e5' : block.color
                                }}
                            >
                                {block.label}
                            </motion.div>
                        ))}

                        {/* Active Moving Block */}
                        <div
                            className="h-[40px] bg-white absolute transition-transform duration-0 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            style={{
                                width: currentBlock.width,
                                bottom: stack.length * 40,
                                transform: `translateX(${currentBlock.x}px)`
                            }}
                        />

                        {/* Target Line Indicator aka "Next Level" */}
                        <div className="absolute left-0 w-full border-t border-dashed border-white/10" style={{ bottom: TARGET_STACK * 40 }} />
                    </div>
                )}

                {gameState === 'lost' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center bg-black/80 backdrop-blur p-8 rounded-sm border border-red-500/30"
                    >
                        <h3 className="text-2xl font-serif text-white mb-2">Instabiel.</h3>
                        <p className="text-neutral-400 text-sm mb-6">De constructie voldoet niet aan de eisen.</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); startGame(); }}
                            className="text-xs uppercase tracking-widest hover:text-white text-neutral-500 border-b border-transparent hover:border-white transition-all pb-1"
                        >
                            Probeer Opnieuw
                        </button>
                    </motion.div>
                )}

                {gameState === 'won' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center bg-black/80 backdrop-blur p-12 rounded-sm border border-emerald-500/30"
                    >
                        <Trophy size={48} className="mx-auto mb-6 text-emerald-500" />
                        <h3 className="text-3xl font-serif text-white mb-4">Visie Gerealiseerd.</h3>
                        <p className="text-neutral-400 text-sm max-w-xs mx-auto mb-8">
                            Een perfect fundament voor succes. Dit is de kwaliteit die wij leveren.
                        </p>
                        <div onClick={(e) => { e.stopPropagation(); onClose(); }}>
                            <Button variant="white">Terug naar Studio</Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer hint */}
            {gameState === 'playing' && (
                <div className="absolute bottom-12 text-[10px] uppercase tracking-[0.2em] text-neutral-600 animate-pulse">
                    Klik om te plaatsen
                </div>
            )}
        </motion.div>
    );
};
