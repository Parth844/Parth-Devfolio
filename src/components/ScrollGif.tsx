import React, { useEffect, useState, useRef } from 'react';

const ScrollGif = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    // Mouse tracking state for the eye
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            const windowHeight = window.innerHeight;
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );

            const maxScroll = documentHeight - windowHeight;
            const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

            const safeProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(safeProgress);

            if (currentScrollY < lastScrollY - 2) {
                setIsScrollingUp(true);
            } else if (currentScrollY > lastScrollY + 2) {
                setIsScrollingUp(false);
            }

            setLastScrollY(currentScrollY);

            setIsScrolling(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [lastScrollY]);

    // Handle global mouse movement for the eye
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Calculate eye position relative to container
    useEffect(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        // The black circle is roughly on the left side of the character's head.
        // We define the "center" of that eye relative to the bounding box.
        // Based on the image, the eye is approximately at:
        // X: ~25% from the left
        // Y: ~50% from the top
        const eyeCenterX = rect.left + (rect.width * 0.25);
        const eyeCenterY = rect.top + (rect.height * 0.50);

        const deltaX = mousePos.x - eyeCenterX;
        const deltaY = mousePos.y - eyeCenterY;

        // Constrain the movement to a maximum radius
        const maxOffset = 0.8; // px

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) {
            // Normalize and multiply by maxOffset, but keep it proportional to distance if very close
            const factor = Math.min(distance, maxOffset) / distance;
            setEyeOffset({
                x: deltaX * factor,
                y: deltaY * factor
            });
        } else {
            setEyeOffset({ x: 0, y: 0 });
        }
    }, [mousePos]);

    const topPercentage = 10 + (scrollProgress * 80);

    const showForward = isScrolling && !isScrollingUp;
    const showReverse = isScrolling && isScrollingUp;
    const showPaused = !isScrolling;

    let rotation = '0deg';
    if (isScrolling) {
        rotation = isScrollingUp ? '-10deg' : '10deg';
    }

    // The black circle position percentage inside the 724x1024 frame
    // You might need to tweak these slightly to match exactly where the black circle is
    const eyeBaseLeft = '36%';
    const eyeBaseTop = '45%';

    return (
        <div
            className="fixed z-[100] pointer-events-none transition-all duration-300 ease-out flex items-center justify-center p-2"
            style={{
                right: '0px',
                top: `${topPercentage}%`,
                transform: `translateY(-50%) rotate(${rotation})`
            }}
        >
            <div
                id="bb8-target"
                ref={containerRef}
                className="relative group w-16 md:w-20 opacity-80"
                style={{ aspectRatio: '724/1024' }}
            >
                <img
                    src="/scroll-animation.gif"
                    alt="Scroll Down"
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-75 ${showForward ? 'opacity-100' : 'opacity-0'}`}
                />
                <img
                    src="/scroll-animation-reversed.gif"
                    alt="Scroll Up"
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-75 ${showReverse ? 'opacity-100' : 'opacity-0'}`}
                />
                <img
                    src="/scroll-animation-paused.png"
                    alt="Paused"
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-75 ${showPaused ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* The Tracking Eye - Only visible on desktop/where mouse moves */}
                <div
                    className="absolute w-[3px] h-[3px] bg-white rounded-full transition-transform duration-75 shadow-sm opacity-90"
                    style={{
                        left: eyeBaseLeft,
                        top: eyeBaseTop,
                        // Offset it based on mouse, but also translate(-50%, -50%) to center the dot on the coordinates
                        transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                    }}
                />
            </div>
        </div>
    );
};

export default ScrollGif;
