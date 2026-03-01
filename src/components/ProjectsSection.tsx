import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Lost-Buddy", desc: "Pioneering AI-driven search tool utilizing Deep Learning facial embeddings to achieve 98% identification accuracy for missing person cases.", tech: ["Python", "FastAPI", "Deep Learning"], gradient: "from-primary/20 to-accent/20", colSpan: "md:col-span-2", rowSpan: "md:row-span-2", link: "https://github.com/Parth844/Sih-chatbot-main" },
  { title: "ARKITECH", desc: "Unity-based Augmented Reality (AR) tour platform for immersive 3D architectural visualization.", tech: ["Unity", "C#", "AR"], gradient: "from-accent/20 to-primary/20", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", link: "https://github.com/Parth844/ARkitechs" },
  { title: "LaneGuard AI", desc: "Intelligent Traffic Lane Enforcement System with automated violation tracking.", tech: ["Computer Vision", "Python"], gradient: "from-primary/20 to-primary/10", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", link: "https://github.com/Parth844/LaneGuard-AI-Intelligent-Traffic-Lane-Enforcement-System" },
  { title: "FaceID-Pro", desc: "Professional, real-time facial recognition web application.", tech: ["Flask", "dlib", "Python"], gradient: "from-accent/20 to-accent/10", colSpan: "md:col-span-2", rowSpan: "md:row-span-1", link: "https://github.com/Parth844/FaceID-Pro-Advanced-Facial-Recognition-System" },
];

const ProjectCard = ({ project, i }: { project: typeof projects[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  // 3D Tilt Effect Setup (subtler for bento)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group bg-card border-b md:border-b-0 md:border-r border-border overflow-hidden block ${project.colSpan} ${project.rowSpan} last:border-r-0`}
    >
      {/* Background Graphic Area */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
        style={{ transform: "translateZ(10px)" }}
      >
        <motion.div
          animate={{ x: hovered ? "100%" : "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -skew-x-12"
        />
      </div>

      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col" style={{ transform: "translateZ(30px)" }}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {project.title}
          </h3>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background/50 text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md flex-grow">{project.desc}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-3 py-1 bg-secondary text-secondary-foreground uppercase tracking-wider font-semibold border border-transparent group-hover:border-border transition-colors">
              {t}
            </span>
          ))}
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
    // Only apply pinning on larger screens to avoid mobile jank
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
    <section id="projects" className="border-b border-border bg-background relative" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-12 relative">

        {/* Left Column - Pinned Title */}
        <div
          ref={leftColRef}
          className="md:col-span-4 p-6 lg:p-10 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-center bg-glass backdrop-blur-md relative z-10"
        >
          <div ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">
                Selected Work
              </p>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground">
                Built<br />
                For<br />
                <span className="text-primary">Scale</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content Grid */}
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
