import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "UI/UX Design",
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    color: "from-primary to-primary/60",
  },
  {
    title: "Programming",
    skills: ["Python", "Java", "C++", "JavaScript"],
    color: "from-accent to-accent/60",
  },
  {
    title: "AI & Machine Learning",
    skills: ["TensorFlow", "Computer Vision", "NLP", "Data Science"],
    color: "from-primary to-accent",
  },
  {
    title: "Blockchain & Web3",
    skills: ["Smart Contracts", "DApps", "Solidity", "Ethereum"],
    color: "from-accent to-primary",
  },
  {
    title: "Game Dev & XR",
    skills: ["Unity", "AR/VR", "3D Modeling", "Computer Vision"],
    color: "from-primary/80 to-accent/80",
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Skills</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Tools & <span className="gradient-text">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass rounded-xl p-6 group hover:border-primary/30 transition-all duration-500 hover:neon-glow relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <h3 className="font-display font-semibold text-lg mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md text-sm bg-secondary text-secondary-foreground border border-border hover:border-primary/40 hover:text-primary transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
