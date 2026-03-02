import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);
    const [combatMode, setCombatMode] = useState(false);
    const [lasers, setLasers] = useState<{ id: number; x: number; y: number; angle: number; createdAt: number }[]>([]);

    // Track target position for aiming
    const targetRef = useRef<{ x: number, y: number } | null>(null);
    const lastFiredRef = useRef<number>(0);

    // Mouse position values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth trailing effect
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Calculate velocity for diagonal rotation/banking effect
    const cursorXVelocity = useVelocity(cursorXSpring);
    // Maps a moving velocity of -800 to 800 pixels/sec into a -20 to 20 degree rotation
    const cursorTilt = useTransform(cursorXVelocity, [-800, 800], [-20, 20]);

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
                target.tagName.toLowerCase() === "button" ||
                target.closest('a') ||
                target.closest('button')
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

    // Combat tracking loop
    useEffect(() => {
        let frameId: number;

        const loop = () => {
            const bb8 = document.getElementById('bb8-target');
            if (bb8) {
                const rect = bb8.getBoundingClientRect();
                // Find center of bb8
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                targetRef.current = { x: targetX, y: targetY };

                // Calculate distance from cursor to BB8
                const dx = targetX - cursorX.get();
                const dy = targetY - cursorY.get();
                const distance = Math.hypot(dx, dy);

                const inRange = distance < 200 && distance > 50; // Don't fire if right on top of it
                setCombatMode(inRange);

                // Fire laser if in range and cooldown has passed
                const now = Date.now();
                if (inRange && now - lastFiredRef.current > (Math.random() * 400 + 300)) { // Random interval between 300ms and 700ms
                    // Calculate angle to target
                    const angle = Math.atan2(dy, dx);

                    setLasers(prev => [...prev, {
                        id: now,
                        x: cursorX.get(),
                        y: cursorY.get(),
                        angle: angle,
                        createdAt: now
                    }]);

                    lastFiredRef.current = now;
                }
            } else {
                setCombatMode(false);
            }

            // Cleanup old lasers (older than 2 seconds)
            const currentTime = Date.now();
            setLasers(prev => prev.filter(l => currentTime - l.createdAt < 2000));

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [cursorX, cursorY]);

    // If on mobile/touch device, don't render the custom cursor
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    // Determine final TIE Fighter rotation
    // If in combat mode, rotate to face the target. Otherwise, use the velocity banking.
    let finalRotation: any = cursorTilt;
    if (combatMode && targetRef.current) {
        // Find angle between cursor and target, convert to degrees
        const dx = targetRef.current.x - cursorX.get();
        const dy = targetRef.current.y - cursorY.get();
        // Add 90 degrees because the TIE fighter image faces "up" by default or straight on
        finalRotation = (Math.atan2(dy, dx) * 180 / Math.PI);
    }

    return (
        <>
            {/* The outer glowing trail ring */}
            <motion.div
                className="fixed top-0 left-0 w-24 h-24 md:w-32 md:h-32 rounded-full pointer-events-none z-[9998] transition-opacity duration-300 pointer-events-none"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible && !isPointer ? 0.3 : 0,
                    // Soft white radial gradient that fades out
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
                }}
            />
            {/* The active TIE Fighter cursor */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                    rotate: finalRotation
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
            >
                <img src="/tie-fighter-cursor-bg-transparent.png" alt="Cursor" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
            </motion.div>

            {/* Render Lasers */}
            {lasers.map(laser => {
                // Approximate distance traveled per frame. (1000px/s)
                // A better approach is using Framer Motion's animate, but we can do a simple CSS animation here too
                // For a dynamic starting point, we'll use a framer-motion div that tweens to the target

                // Calculate far endpoint based on angle
                const endX = laser.x + Math.cos(laser.angle) * 1000;
                const endY = laser.y + Math.sin(laser.angle) * 1000;

                return (
                    <motion.div
                        key={laser.id}
                        className="fixed top-0 left-0 w-8 h-1 bg-green-500 rounded-full z-[9997] pointer-events-none"
                        style={{
                            boxShadow: "0 0 8px 2px rgba(34, 197, 94, 0.8), 0 0 16px 4px rgba(34, 197, 94, 0.4)",
                            rotate: `${laser.angle}rad`,
                            translateX: "-50%",
                            translateY: "-50%"
                        }}
                        initial={{ x: laser.x, y: laser.y, opacity: 1 }}
                        animate={{ x: endX, y: endY, opacity: 0 }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                );
            })}
        </>
    );
};

export default CustomCursor;
