import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect users who prefer reduced motion — don't hijack their scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis v1.3 API (the old v0 keys — smooth/smoothTouch/direction — were silently
    // ignored, so the previous config never actually took effect).
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker and keep ScrollTrigger in sync. Use a named
    // function so the cleanup below can actually remove it (the old code passed a
    // fresh arrow to remove(), which never matched → leaked a raf loop per HMR).
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
