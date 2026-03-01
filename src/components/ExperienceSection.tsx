import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, Target } from "lucide-react";

const achievements = [
  { icon: Trophy, title: "Hackathon Participant", desc: "Competed in multiple hackathons, building innovative solutions under pressure and collaborating with diverse teams." },
  { icon: Users, title: "PixelEdge Workshops", desc: "Led and participated in design workshops, sharing knowledge about UI/UX principles and creative design thinking." },
  { icon: Target, title: "DSA Milestones", desc: "Consistently building problem-solving skills through competitive programming and data structure challenges." },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <section id="experience" className="section-padding relative overflow-hidden" ref={sectionRef}>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["50px", "-80px"]) }}
        className="absolute left-1/4 top-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="glass rounded-xl p-8 group hover:border-primary/30 transition-all duration-500 hover:neon-glow text-center"
            >
              <motion.div
                className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <item.icon className="text-primary" size={24} />
              </motion.div>
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
