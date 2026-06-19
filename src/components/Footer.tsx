import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Parth844" },
  { label: "LinkedIn", href: "https://linkedin.com/in/parthtyagi-design" },
  { label: "Email", href: "mailto:Parthtyagi520@gmail.com" },
];

const Footer = () => (
  <footer className="border-t border-border bg-background relative overflow-hidden">
    {/* Top gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

    <div className="max-w-[90rem] mx-auto border-x border-border">
      {/* Large decorative text */}
      <div className="px-8 md:px-16 pt-16 pb-8 border-b border-border overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display font-black text-[clamp(3rem,12vw,9rem)] leading-none tracking-tighter text-foreground/5 select-none"
        >
          PARTH TYAGI
        </motion.p>
      </div>

      {/* Main footer row */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Brand */}
        <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">AI/ML Developer & Designer</p>
            <h3 className="font-display font-bold text-2xl text-foreground">Parth Tyagi</h3>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Open to opportunities</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8 md:p-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Navigation</p>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-foreground/60 hover:text-primary transition-colors duration-300 text-sm font-medium flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials + CTA */}
        <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Connect</p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-primary transition-colors duration-300 text-sm font-medium flex items-center gap-1 group"
                  >
                    {s.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/Parth_Tyagi_Resume.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:bg-accent hover:shadow-[0_0_30px_hsl(18_66%_59%/0.3)] transition-all duration-300 w-fit"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-12 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © 2026 Parth Tyagi. Crafted with passion & code.
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          Portfolio v3.0 · Built with React + Three.js
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
