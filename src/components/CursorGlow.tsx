import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let x = 0;
    let y = 0;

    // Write straight to the DOM via a ref instead of React state, and throttle to one
    // update per animation frame. Moving with `transform` (compositor) instead of
    // `left`/`top` (layout) keeps this entirely off the main-thread layout path.
    const handler = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (el) el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 pointer-events-none z-40 hidden md:block will-change-transform"
      style={{
        width: 400,
        height: 400,
        background: "radial-gradient(circle, hsl(151 55% 52% / 0.07) 0%, transparent 70%)",
        // GPU-friendly trailing ease (transform-only transition stays on the compositor).
        transition: "transform 0.12s ease-out",
      }}
    />
  );
};

export default CursorGlow;
