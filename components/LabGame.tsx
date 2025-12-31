import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Dribbble } from 'lucide-react';
import { Button } from './Button';

interface LabGameProps {
    onClose: () => void;
    onComplete: () => void;
}

// --- CONFIG ---
const GRAVITY = 0.8;
const FRICTION = 0.99;
const BOUNCE = 0.7;
const GAME_WIDTH = 800; // Virtual width for physics calcs
const GAME_HEIGHT = 600;
const HOOP_X = 650;
const HOOP_Y = 250;
const HOOP_RADIUS = 35; // Radius of the target area
const BALL_RADIUS = 20;

const USPs = [
    "Pixel Perfect Design",
    "High Performance",
    "Scalable Tech",
    "SEO Optimized",
    "Converting UX",
    "Brand Identity"
];

export const LabGame: React.FC<LabGameProps> = ({ onClose, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'won'>('intro');
    const [score, setScore] = useState(0);
    const [usp, setUsp] = useState("SCORE TO REVEAL");
    const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
    const [dragCurrent, setDragCurrent] = useState<{ x: number, y: number } | null>(null);

    // Physics State
    const ballRef = useRef({
        x: 100,
        y: 400,
        vx: 0,
        vy: 0,
        isFlying: false,
        isDragging: false,
        scored: false
    });

    const requestRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    // --- GAME LOOP ---
    const update = useCallback(() => {
        if (gameState !== 'playing') return;

        const ball = ballRef.current;

        if (ball.isFlying) {
            // Apply Gravity
            ball.vy += GRAVITY;

            // Apply Velocity
            ball.x += ball.vx;
            ball.y += ball.vy;

            // --- COLLISIONS ---

            // Floor
            if (ball.y + BALL_RADIUS > GAME_HEIGHT) {
                ball.y = GAME_HEIGHT - BALL_RADIUS;
                ball.vy *= -BOUNCE;
                ball.vx *= FRICTION; // Ground friction

                // Stop rolling if slow
                if (Math.abs(ball.vy) < 1.5) ball.vy = 0;
                if (Math.abs(ball.vx) < 0.1) ball.vx = 0;

                // Reset logic if stopped
                if (ball.vx === 0 && ball.vy === 0) {
                    resetBallDelayed();
                }
            }

            // Walls (Left/Right)
            if (ball.x - BALL_RADIUS < 0) {
                ball.x = BALL_RADIUS;
                ball.vx *= -BOUNCE;
            }
            if (ball.x + BALL_RADIUS > GAME_WIDTH) {
                ball.x = GAME_WIDTH - BALL_RADIUS;
                ball.vx *= -BOUNCE;
            }

            // Backboard (Vertical Line)
            const backboardX = HOOP_X + 40;
            const backboardTop = HOOP_Y - 80;
            const backboardBottom = HOOP_Y + 10;

            // Backboard Hit logic (simplified)
            if (ball.x + BALL_RADIUS > backboardX && ball.x - BALL_RADIUS < backboardX + 10 && ball.y > backboardTop && ball.y < backboardBottom) {
                ball.vx *= -BOUNCE;
                ball.x = backboardX - BALL_RADIUS;
            }

            // Rim (Point Collision) - Left side of rim
            const rimX = HOOP_X - HOOP_RADIUS;
            const rimY = HOOP_Y;
            const distToRim = Math.sqrt((ball.x - rimX) ** 2 + (ball.y - rimY) ** 2);
            if (distToRim < BALL_RADIUS + 5) {
                // Simple rebound impulse
                const angle = Math.atan2(ball.y - rimY, ball.x - rimX);
                const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
                ball.vx = Math.cos(angle) * speed * BOUNCE;
                ball.vy = Math.sin(angle) * speed * BOUNCE;
            }

            // --- SCORING ---
            // If ball passes through the hoop (y goes from above to below within x range)
            if (!ball.scored && ball.vy > 0 && ball.y > HOOP_Y && ball.y < HOOP_Y + 20) {
                if (ball.x > HOOP_X - HOOP_RADIUS + 5 && ball.x < HOOP_X + HOOP_RADIUS - 5) {
                    handleScore();
                }
            }
        }

        requestRef.current = requestAnimationFrame(update);
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, update]);

    const resetBallDelayed = () => {
        // Only reset if we actually stopped moving significantly or scored
        if (ballRef.current.isFlying) {
            ballRef.current.isFlying = false;
            setTimeout(() => {
                ballRef.current.x = 100 + Math.random() * 50;
                ballRef.current.y = 400;
                ballRef.current.vx = 0;
                ballRef.current.vy = 0;
                ballRef.current.scored = false;
            }, 500);
        }
    };

    const handleScore = () => {
        ballRef.current.scored = true;
        setScore(prev => {
            const newScore = prev + 1;
            setUsp(USPs[newScore % USPs.length]); // Cycle USPs
            if (newScore >= 6) {
                // Optional win condition, or infinite? Let's make it infinite fun, but win at 6 for closure
                setTimeout(() => setGameState('won'), 1000);
            }
            return newScore;
        });
    };

    // --- INPUT HANDLERS ---
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (gameState !== 'playing' || ballRef.current.isFlying) return;
        const pt = e.nativeEvent instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : { x: e.nativeEvent.touches[0].clientX, y: e.nativeEvent.touches[0].clientY };

        // Check if close to ball (mapped to screen coords roughly)
        // For simplicity, allow drag anywhere to aim like Angry Birds style
        setDragStart(pt);
        setDragCurrent(pt);
        ballRef.current.isDragging = true;
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!ballRef.current.isDragging || !dragStart) return;
        const pt = e.nativeEvent instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : { x: e.nativeEvent.touches[0].clientX, y: e.nativeEvent.touches[0].clientY };
        setDragCurrent(pt);
    };

    const handleMouseUp = () => {
        if (!ballRef.current.isDragging || !dragStart || !dragCurrent) return;

        // Launch!
        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;

        // Power multiplier
        const power = 0.15;

        ballRef.current.vx = dx * power;
        ballRef.current.vy = dy * power;
        ballRef.current.isFlying = true;
        ballRef.current.isDragging = false;

        setDragStart(null);
        setDragCurrent(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-neutral-950 flex flex-col items-center justify-center font-mono select-none overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >
            {/* --- UI LAYER --- */}
            <div className="absolute top-8 left-8 right-8 z-30 pointer-events-none flex justify-between">
                <div>
                    <div className="text-neutral-500 text-xs tracking-widest mb-1">SCORE</div>
                    <div className="text-4xl text-neon-green font-bold text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                        {score.toString().padStart(2, '0')}
                    </div>
                </div>

                {/* BIG USP DISPLAY */}
                <div className="flex-1 text-center px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={usp}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="text-white font-bold text-lg md:text-3xl uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        >
                            {usp}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="pointer-events-auto cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                        <X />
                    </div>
                </div>
            </div>

            {gameState === 'intro' && (
                <div className="absolute z-40 text-center pointer-events-none">
                    <Dribbble size={64} className="mx-auto text-orange-500 mb-6 animate-bounce" />
                    <h2 className="text-4xl text-white font-bold mb-2 tracking-widest">ARCADE MODE</h2>
                    <p className="text-neutral-400 mb-8 uppercase text-xs tracking-[0.2em]">Drag. Aim. Shoot.</p>
                    <div className="pointer-events-auto inline-block" onClick={() => setGameState('playing')}>
                        <Button variant="white">START GAME</Button>
                    </div>
                </div>
            )}

            {/* --- GAME CANVAS AREA --- */}
            {/* We use a simplified responsive scaling: calculate everything in 800x600 space, then scale div to fit screen */}
            <div
                className="relative w-[800px] h-[600px] bg-neutral-900/50 rounded-xl border border-white/5 shadow-2xl overflow-hidden"
                style={{
                    transform: 'scale(0.8)', // Dynamically scale this on resize ideally, kept simple for now
                    transformOrigin: 'center center'
                }}
            >
                {/* Floor */}
                <div className="absolute bottom-0 w-full h-[20px] bg-[#333]" />

                {/* Hoop Structure */}
                <div className="absolute" style={{ left: HOOP_X + 40, top: HOOP_Y - 100 }}>
                    {/* Backboard */}
                    <div className="w-4 h-[120px] bg-white/20 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                    {/* Stand */}
                    <div className="absolute top-[80px] left-[4px] w-[50px] h-[1000px] bg-neutral-800" />
                </div>

                {/* Rim */}
                <div className="absolute w-[70px] h-[4px] bg-orange-500 shadow-[0_0_10px_orange]" style={{ left: HOOP_X - 35, top: HOOP_Y }} />
                {/* Net (Visual) */}
                <div className="absolute w-[60px] h-[50px] border-l border-r border-b border-white/30 rounded-b-xl"
                    style={{ left: HOOP_X - 30, top: HOOP_Y + 4, background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 6px)' }}
                />


                {/* Aim Line (Trajectory Hint) */}
                {dragStart && dragCurrent && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                        <line
                            x1={ballRef.current.x}
                            y1={ballRef.current.y}
                            x2={ballRef.current.x + (dragStart.x - dragCurrent.x) * 2}
                            y2={ballRef.current.y + (dragStart.y - dragCurrent.y) * 2}
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                    </svg>
                )}

                {/* The Ball */}
                <motion.div
                    className="absolute w-[40px] h-[40px] bg-orange-500 rounded-full flex items-center justify-center text-orange-900 border-2 border-orange-400 shadow-[0_0_15px_orange]"
                    style={{
                        x: ballRef.current.x - BALL_RADIUS, // Motion handles the pixel translation efficiently? No, better use refs for game loop
                    }}
                    // We bind the ref values to the visual using a framer motion update or simple rAF re-render.
                    // Since React state is too slow for 60fps physics, we force update logic.
                    // For this simple version, we can put positions in state? 
                    // No, let's use a forceUpdate or ref-based style mutation.
                    ref={el => {
                        if (el) {
                            el.style.transform = `translate(${ballRef.current.x - BALL_RADIUS}px, ${ballRef.current.y - BALL_RADIUS}px)`;
                        }
                    }}
                >
                    <div className="w-full h-[1px] bg-orange-900 rotate-45" />
                    <div className="absolute w-full h-[1px] bg-orange-900 -rotate-45" />
                </motion.div>

            </div>

            {gameState === 'won' && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
                    <Trophy size={80} className="text-yellow-400 mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold text-white mb-4 uppercase text-center">MVP Performance</h1>
                    <p className="text-neutral-400 mb-8 max-w-md text-center">You've unlocked the full potential.</p>
                    <div onClick={() => { setGameState('intro'); setScore(0); }} className="cursor-pointer">
                        <Button variant="white">PLAY AGAIN</Button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
