import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Brain, Palette, Code } from "lucide-react";

const timeline = [
  { year: "2021", title: "Started Coding Journey", desc: "Dived into Python, Java, and C++ fundamentals" },
  { year: "2022", title: "UI/UX Design Discovery", desc: "Fell in love with Figma and design thinking" },
  { year: "2023", title: "AI & ML Exploration", desc: "Built first AI projects and explored machine learning" },
  { year: "2024", title: "Web3 & Innovation", desc: "Blockchain concepts, hackathons, and pushing boundaries" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const AboutSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);
  const orbParallax = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);

  return (
    <section id="about" className="section-padding relative overflow-hidden" ref={sectionRef}>
      {/* Parallax background orb */}
      <motion.div
        style={{ y: orbParallax }}
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">About Me</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            A Tech Enthusiast with a<br />
            <span className="gradient-text">Creative Edge</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            I'm Parth Tyagi — a passionate builder at the intersection of design and technology.
            I thrive on creating experiences that merge AI, Machine Learning, Web3 innovation,
            and pixel-perfect design into products that matter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Palette, label: "Design", desc: "Pixel-perfect interfaces" },
            { icon: Code, label: "Code", desc: "Clean, scalable solutions" },
            { icon: Brain, label: "AI/ML", desc: "Intelligent systems" },
            { icon: Sparkles, label: "Innovation", desc: "Pushing boundaries" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass rounded-xl p-6 text-center group hover:border-primary/30 transition-all duration-300 hover:neon-glow"
            >
              <item.icon className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" size={28} />
              <h3 className="font-display font-semibold mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, filter: "blur(4px)" }}
              animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative flex items-start mb-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex-row`}
            >
              <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                <div className="glass rounded-xl p-5 inline-block hover:border-primary/20 transition-all duration-500">
                  <span className="text-primary font-display font-bold text-lg">{item.year}</span>
                  <h4 className="font-display font-semibold mt-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
              <motion.div
                className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 mt-2 neon-glow"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.2, type: "spring", stiffness: 300 }}
              />
              <div className="md:hidden pl-10">
                <span className="text-primary font-display font-bold">{item.year}</span>
                <h4 className="font-display font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
