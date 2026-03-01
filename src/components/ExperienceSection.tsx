import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, Target } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { icon: Trophy, title: "Hackathon Participant", desc: "Competed in multiple hackathons, building innovative solutions under pressure and collaborating with diverse teams.", colSpan: "md:col-span-2" },
  { icon: Users, title: "PixelEdge Workshops", desc: "Led and participated in design workshops, sharing knowledge about UI/UX principles and creative design thinking.", colSpan: "md:col-span-1" },
  { icon: Target, title: "DSA Milestones", desc: "Consistently building problem-solving skills through competitive programming and data structure challenges.", colSpan: "md:col-span-1" },
];

const ExperienceCard = ({ item, i }: { item: typeof achievements[0]; i: number }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className={`glass rounded-xl p-8 md:p-12 group border border-border hover:border-primary/30 transition-all duration-500 hover:neon-glow ${item.colSpan}`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          <item.icon className="text-primary" size={28} />
        </motion.div>
        <h3 className="font-display font-semibold text-2xl md:text-3xl text-foreground">{item.title}</h3>
      </div>
      <p className="text-muted-foreground md:text-lg leading-relaxed">{item.desc}</p>
    </motion.div>
  );
};

const ExperienceSection = () => {
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
    <section id="experience" className="border-b border-border bg-background relative" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-12 relative">

        {/* Left Column - Pinned */}
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
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">Experience</p>
              <h2 className="font-display text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground">
                Achievements<br />
                &<br />
                <span className="text-primary">Milestones</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content */}
        <div ref={rightColRef} className="md:col-span-8 flex flex-col p-8 md:p-12 justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((item, i) => (
              <ExperienceCard key={item.title} item={item} i={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
