import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Send } from "lucide-react";

const roles = ["UI/UX Designer", "AI Explorer", "Tech Innovator", "Web3 Enthusiast"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 h-8 font-display">
            {text}
            <span className="animate-pulse text-primary">|</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
      </div>
    </section>
  );
};

export default HeroSection;
