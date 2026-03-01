import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, Target } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Hackathon Participant",
    desc: "Competed in multiple hackathons, building innovative solutions under pressure and collaborating with diverse teams.",
  },
  {
    icon: Users,
    title: "PixelEdge Workshops",
    desc: "Led and participated in design workshops, sharing knowledge about UI/UX principles and creative design thinking.",
  },
  {
    icon: Target,
    title: "DSA Milestones",
    desc: "Consistently building problem-solving skills through competitive programming and data structure challenges.",
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="section-padding relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Experience</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Achievements & <span className="gradient-text">Milestones</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="glass rounded-xl p-8 group hover:border-primary/30 transition-all duration-500 hover:neon-glow text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
