import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "UI/UX Design",
    icon: "◈",
    color: "from-primary to-accent",
    skills: [
      { name: "Figma", level: 92 },
      { name: "Prototyping", level: 88 },
      { name: "Wireframing", level: 85 },
      { name: "Adobe Illustrator", level: 75 },
    ],
  },
  {
    title: "Programming",
    icon: "⟨⟩",
    color: "from-accent to-primary",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript / TS", level: 88 },
      { name: "C++ / C#", level: 80 },
      { name: "SQL", level: 75 },
    ],
  },
  {
    title: "AI & Computer Vision",
    icon: "◎",
    color: "from-primary to-primary/60",
    skills: [
      { name: "Deep Learning", level: 90 },
      { name: "OpenCV", level: 92 },
      { name: "TensorFlow / PyTorch", level: 85 },
      { name: "FastAPI", level: 82 },
    ],
  },
  {
    title: "AR & 3D",
    icon: "⬡",
    color: "from-accent/80 to-primary/80",
    skills: [
      { name: "Unity", level: 88 },
      { name: "ARCore / ARKit", level: 84 },
      { name: "Blender", level: 72 },
      { name: "Spatial Computing", level: 78 },
    ],
  },
  {
    title: "Tools & Infrastructure",
    icon: "⊞",
    color: "from-primary/80 to-accent",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Docker", level: 78 },
      { name: "Linux", level: 82 },
      { name: "Xcode", level: 70 },
    ],
  },
];

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground/80 font-medium">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3 }}
          className="text-xs text-primary font-mono font-bold"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_hsl(32_80%_68%)]" />
        </motion.div>
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={sectionRef}>
      {/* Ambient background glow */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]) }}
        className="absolute -left-40 top-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["-40px", "40px"]) }}
        className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-accent/4 blur-[130px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Section header */}
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Expertise</p>
            <h2 className="font-display text-3xl md:text-6xl font-bold leading-none tracking-tighter">
              Tools & <span className="gradient-text">Technologies</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right">
            Crafted through real-world projects, hackathons, and relentless iteration.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-background p-8 group hover:bg-card transition-colors duration-500 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon + title */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl text-primary font-mono leading-none">{cat.icon}</span>
                <h3 className="font-display font-bold text-lg text-foreground">{cat.title}</h3>
              </div>

              {/* Skill bars */}
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={0.15 * i + 0.08 * si} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* "More skills" filler cell */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-background p-8 flex flex-col justify-between group hover:bg-card transition-colors duration-500 relative overflow-hidden sm:col-span-2 lg:col-span-1"
          >
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <p className="text-5xl font-black text-primary/20 font-display leading-none">20+</p>
            <div>
              <h3 className="font-display font-bold text-2xl mb-2">Technologies Mastered</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Constantly learning, building, and pushing boundaries across AI, design, and spatial computing.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
