import React, { useEffect, useState, useRef } from 'react';

const ScrollGif = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Eye offset (the only mouse-derived value we render). lastScrollY is internal
    // bookkeeping, so it lives in a ref — keeping it out of state is what lets the
    // scroll listener mount exactly once instead of re-attaching on every scroll event.
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);
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
            setScrollProgress(Math.min(Math.max(progress, 0), 1));

            const last = lastScrollYRef.current;
            if (currentScrollY < last - 2) {
                setIsScrollingUp(true);
            } else if (currentScrollY > last + 2) {
                setIsScrollingUp(false);
            }
            lastScrollYRef.current = currentScrollY;

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
    }, []);

    // Eye tracking: follow the pointer with a tiny offset. rAF-throttled, and computing
    // the offset inline means one state update per frame instead of two setStates on
    // every single mousemove event.
    useEffect(() => {
        let frame = 0;
        let mx = 0;
        let my = 0;

        const compute = () => {
            frame = 0;
            const el = containerRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            // Eye sits ~25% from the left, ~50% down inside the character's head.
            const eyeCenterX = rect.left + rect.width * 0.25;
            const eyeCenterY = rect.top + rect.height * 0.5;

            const deltaX = mx - eyeCenterX;
            const deltaY = my - eyeCenterY;
            const maxOffset = 0.8; // px
            const distance = Math.hypot(deltaX, deltaY);

            if (distance > 0) {
                const factor = Math.min(distance, maxOffset) / distance;
                setEyeOffset({ x: deltaX * factor, y: deltaY * factor });
            } else {
                setEyeOffset({ x: 0, y: 0 });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            if (!frame) frame = requestAnimationFrame(compute);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    const topPercentage = 10 + (scrollProgress * 80);

    const showForward = isScrolling && !isScrollingUp;
    const showReverse = isScrolling && isScrollingUp;
    const showPaused = !isScrolling;

    let rotation = '0deg';
    if (isScrolling) {
        rotation = isScrollingUp ? '-10deg' : '10deg';
    }

    // The black circle position percentage inside the 724x1024 frame
    const eyeBaseLeft = '36%';
    const eyeBaseTop = '45%';

    return (
        <div
            className="fixed z-[100] pointer-events-none transition-all duration-300 ease-out flex items-center justify-center p-0"
            style={{
                right: '0.8px',
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
                        transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                    }}
                />
            </div>
        </div>
    );
};

export default ScrollGif;
