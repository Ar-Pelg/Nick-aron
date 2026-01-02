import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TextScrambleProps {
    children: string;
    className?: string;
    scrambleSpeed?: number;
    revealSpeed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export const TextScramble: React.FC<TextScrambleProps> = ({
    children,
    className = "",
    scrambleSpeed = 30,
    revealSpeed = 50
}) => {
    const [displayText, setDisplayText] = useState(children);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsScrambling(true);

        let iteration = 0;

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                children
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return children[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= children.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsScrambling(false);
            }

            iteration += 1 / 3; // Slower reveal for more dramatic effect
        }, scrambleSpeed);
    };

    const stopScramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(children);
        setIsScrambling(false);
    };

    return (
        <motion.span
            className={`inline-block cursor-default ${className}`}
            onMouseEnter={startScramble}
            onMouseLeave={stopScramble}
        >
            {displayText}
        </motion.span>
    );
};
