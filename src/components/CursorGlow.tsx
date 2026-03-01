import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-40 hidden md:block"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: "radial-gradient(circle, hsla(199, 89%, 48%, 0.06) 0%, transparent 70%)",
        transition: "left 0.1s ease-out, top 0.1s ease-out",
      }}
    />
  );
};

export default CursorGlow;
