import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(151, 55%, 52%), hsl(217, 91%, 60%))",
        boxShadow: "0 0 8px hsl(151 55% 52% / 0.6)",
      }}
    />
  );
};

export default ScrollProgress;
