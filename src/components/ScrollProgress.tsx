import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(18, 66%, 59%), hsl(32, 80%, 68%))",
        boxShadow: "0 0 8px hsl(18 66% 59% / 0.6)",
      }}
    />
  );
};

export default ScrollProgress;
