import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowDown, Send } from "lucide-react";

const roles = ["UI/UX Designer", "AI Explorer", "Tech Innovator", "Web3 Enthusiast"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setRoleIndex((i) => (i + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Parallax gradient orbs */}
      <motion.div style={{ y: orbY1 }} className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <motion.div style={{ y: orbY2 }} className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" />

      <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-6">
            Welcome to my universe
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Designing the Future
            <br />
            <span className="gradient-text">with AI & Creativity</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 h-8 font-display">
            {text}
            <span className="animate-pulse text-primary">|</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(199,89%,48%,0.3)] transition-all duration-300 transform hover:scale-105"
          >
            View Projects
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-lg font-medium glass text-foreground hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Send size={16} /> Contact Me
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="text-muted-foreground animate-bounce" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
