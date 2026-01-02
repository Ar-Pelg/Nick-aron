import { useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

export const useScrollVelocity = () => {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    return smoothVelocity;
};

export const useSkew = () => {
    const velocity = useScrollVelocity();
    const skewX = useTransform(velocity, [-1000, 1000], [0, 0]); // Base skew
    // We can't return the transform directly if we want adjustable range, 
    // so we'll just return the raw velocity or a standard skew.
    // Actually, let's return a function to get skew based on range.

    return velocity;
}
