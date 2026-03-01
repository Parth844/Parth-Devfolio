import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);

    // Mouse position values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth trailing effect
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handlePointerOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button"
            ) {
                setIsPointer(true);
            } else {
                setIsPointer(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mouseover", handlePointerOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseover", handlePointerOver);
        };
    }, [cursorX, cursorY, isVisible]);

    // If on mobile/touch device, don't render the custom cursor
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isPointer ? 3 : 1,
                    backgroundColor: isPointer ? "hsl(var(--primary) / 0.5)" : "hsl(var(--primary))"
                }}
                transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
            />
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 rounded-full border border-primary/30 pointer-events-none z-[9998] transition-opacity duration-300"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible && !isPointer ? 1 : 0,
                }}
            />
        </>
    );
};

export default CustomCursor;
