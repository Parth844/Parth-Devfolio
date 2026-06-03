import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Send } from "lucide-react";

const links = ["About", "Skills", "Projects", "Experience", "Contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [visible, setVisible] = useState(true);
  
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state for transition
      setScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      lastScrollY.current = currentScrollY;

      // Section tracker
      const sections = links.map((l) => l.toLowerCase());
      const scrollPosition = currentScrollY + 150; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: visible ? 0 : -100, 
        opacity: visible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-6 flex justify-center pointer-events-none"
    >
      <div
        className={`w-full max-w-5xl flex items-center justify-between pointer-events-auto transition-all duration-500 ${
          scrolled
            ? "glass-strong rounded-full px-6 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-border/60 backdrop-blur-lg"
            : "px-6 py-2 bg-transparent"
        }`}
      >
        {/* Brand Logo */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="relative group flex items-center"
          animate={{
            y: [0, -6, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-14 w-auto filter drop-shadow-[0_0_8px_hsl(var(--primary))] drop-shadow-[0_0_20px_hsl(var(--primary)/0.8)] drop-shadow-[0_0_35px_hsl(var(--primary)/0.5)] hover:brightness-110 hover:scale-105 transition-all duration-300"
          />
        </motion.button>

        {/* Desktop Links (Floating Pill Layout) */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/20 border border-border/20 rounded-full p-1 backdrop-blur-md">
          {links.map((l) => {
            const isActive = activeSection === l.toLowerCase();
            return (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className={`relative px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l}
              </button>
            );
          })}
        </div>

        {/* Quick Contact Button */}
        <button
          onClick={() => scrollTo("Contact")}
          className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all duration-300 text-xs font-semibold uppercase tracking-wider"
        >
          <Send size={12} /> Let's Talk
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 rounded-full bg-secondary/50 text-foreground border border-border/40"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 glass-strong p-6 rounded-2xl border border-border/60 flex flex-col gap-4 shadow-2xl pointer-events-auto"
          >
            {links.map((l) => {
              const isActive = activeSection === l.toLowerCase();
              return (
                <button
                  key={l}
                  onClick={() => scrollTo(l)}
                  className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-secondary/40"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
