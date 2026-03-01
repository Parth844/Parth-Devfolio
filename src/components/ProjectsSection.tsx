import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  { title: "GeoState", desc: "A blockchain-powered platform revolutionizing land record management with transparent, immutable transactions.", tech: ["Blockchain", "Solidity", "React", "Node.js"], gradient: "from-primary/20 to-accent/20" },
  { title: "AI Smart Dustbin", desc: "An intelligent waste management system using computer vision to automatically sort and classify waste in real-time.", tech: ["Python", "TensorFlow", "OpenCV", "IoT"], gradient: "from-accent/20 to-primary/20" },
  { title: "PromptMesh", desc: "An AI-driven concept that generates 3D models from natural language prompts, bridging text and spatial design.", tech: ["AI/ML", "Three.js", "Python", "WebGL"], gradient: "from-primary/20 to-primary/10" },
  { title: "Healthy Recipe AI", desc: "A smart web application that recommends personalized healthy recipes based on dietary preferences and available ingredients.", tech: ["React", "Python", "NLP", "API"], gradient: "from-accent/20 to-accent/10" },
];

const ProjectCard = ({ project, i, inView }: { project: typeof projects[0]; i: number; inView: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: i % 2 === 0 ? -5 : 5 }}
      animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.35, ease: "easeOut" } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="glass rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:neon-glow"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 2 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="font-display text-4xl font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors duration-500">
            {project.title}
          </span>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
        {/* Animated shine on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -skew-x-12"
          initial={{ x: "-150%" }}
          animate={{ x: hovered ? "150%" : "-150%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded bg-secondary text-primary border border-border">{t}</span>
          ))}
        </div>
        <button className="text-sm text-primary font-medium flex items-center gap-2 group/btn hover:gap-3 transition-all duration-300">
          View Case Study <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  return (
    <section id="projects" className="section-padding relative overflow-hidden" ref={sectionRef}>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]) }}
        className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Projects</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
