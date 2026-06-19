import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Lost-Buddy",
    desc: "AI-driven missing person search tool using Deep Learning facial embeddings — 98% identification accuracy.",
    tech: ["Python", "FastAPI", "Deep Learning"],
    gradient: "from-primary/15 via-primary/5 to-transparent",
    accentColor: "hsl(18 66% 59%)",
    number: "01",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    link: "https://github.com/Parth844/Sih-chatbot-main",
  },
  {
    title: "ARKITECH",
    desc: "Unity AR platform for immersive 3D architectural visualization — Hackathon 3rd place at Delhi University.",
    tech: ["Unity", "C#", "AR"],
    gradient: "from-accent/15 via-accent/5 to-transparent",
    accentColor: "hsl(32 80% 68%)",
    number: "02",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Parth844/ARkitechs",
  },
  {
    title: "LaneGuard AI",
    desc: "Intelligent traffic lane enforcement with automated real-time violation tracking using computer vision.",
    tech: ["Computer Vision", "Python"],
    gradient: "from-primary/10 via-primary/5 to-transparent",
    accentColor: "hsl(18 66% 59%)",
    number: "03",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Parth844/LaneGuard-AI-Intelligent-Traffic-Lane-Enforcement-System",
  },
  {
    title: "FaceID-Pro",
    desc: "Real-time facial recognition web application with professional-grade accuracy using dlib and Flask.",
    tech: ["Flask", "dlib", "Python"],
    gradient: "from-accent/10 via-accent/5 to-transparent",
    accentColor: "hsl(32 80% 68%)",
    number: "04",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Parth844/FaceID-Pro-Advanced-Facial-Recognition-System",
  },
];

const ProjectCard = ({ project, i }: { project: typeof projects[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);

    // Spotlight effect via CSS custom properties
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group border-b border-r border-border overflow-hidden block ${project.colSpan} ${project.rowSpan} spotlight-card`}
    >
      {/* Spotlight radial gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.accentColor}12, transparent 60%)`,
        }}
      />

      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      {/* Top border on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ background: `linear-gradient(to right, ${project.accentColor}, transparent)` }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col" style={{ transform: "translateZ(20px)" }}>
        {/* Number + arrow */}
        <div className="flex justify-between items-start mb-auto">
          <span className="font-mono text-xs text-muted-foreground/50 font-bold">{project.number}</span>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0, color: hovered ? project.accentColor : undefined }}
            transition={{ duration: 0.3 }}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-background/30 text-muted-foreground group-hover:border-primary/40 transition-colors"
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="mt-12 md:mt-16">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-sm leading-relaxed">
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-xs px-3 py-1 border border-border text-muted-foreground uppercase tracking-wider font-semibold group-hover:border-primary/30 group-hover:text-foreground/70 transition-all duration-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="projects" className="border-b border-border bg-background relative overflow-hidden" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-12 relative">

        {/* Left Column - Pinned Title */}
        <div
          ref={leftColRef}
          className="md:col-span-4 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-between bg-background relative z-10"
        >
          {/* Ambient glow */}
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

          <div ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">Selected Work</p>
              <h2 className="font-display text-4xl md:text-6xl xl:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground">
                Built<br />
                For<br />
                <span className="gradient-text">Scale</span>
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10"
          >
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
              Each project is a story — a problem worth solving, pushed to the edge of what's technically possible.
            </p>
            <a
              href="https://github.com/Parth844"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
            >
              <Github size={16} />
              View all on GitHub
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Right Column - Project Grid */}
        <div ref={rightColRef} className="md:col-span-8 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
