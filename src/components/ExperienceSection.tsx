import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, Target, Briefcase, Calendar, MapPin, Cpu, Workflow } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { icon: Trophy, title: "Gemini Hackathon Winner", desc: "Secured first position by developing an innovative AI solution. Designed and presented a functional prototype under strict time constraints.", colSpan: "md:col-span-2" },
  { icon: Target, title: "Delhi U. Hackathon 3rd", desc: "Secured third position for ARKITECH, an immersive Unity-based Augmented Reality visualization platform.", colSpan: "md:col-span-1" },
  { icon: Users, title: "Hackathon Organizer (3x)", desc: "Organized multiple National and College-Level hackathons. Mentored junior developers in AR/VR and Git workflow optimization.", colSpan: "md:col-span-1" },
];

const AchievementCard = ({ item, index }: { item: (typeof achievements)[number]; index: number }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.3 } }}
      className={`border border-border bg-card/40 backdrop-blur-sm p-6 md:p-8 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden ${item.colSpan}`}
    >
      <div className="flex gap-4 items-center mb-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          <item.icon className="text-primary" size={20} />
        </motion.div>
        <h4 className="font-display font-semibold text-lg md:text-xl text-foreground">{item.title}</h4>
      </div>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.desc}</p>
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
    <section id="experience" className="border-b border-border bg-background relative overflow-hidden" ref={containerRef}>
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
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">Portfolio</p>
              <h2 className="font-display text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground">
                Experience<br />
                &<br />
                <span className="text-primary">Milestones</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content */}
        <div ref={rightColRef} className="md:col-span-8 flex flex-col p-6 md:p-12 justify-center gap-16">
          
          {/* Work Experience Timeline */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-8 flex items-center gap-2">
              <Briefcase size={16} /> Professional Experience
            </h3>
            
            <div className="relative border-l border-border pl-6 md:pl-10 ml-2 md:ml-4 space-y-12">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background animate-pulse shadow-[0_0_10px_hsl(var(--primary))]" />
              
              {/* NimbusPost Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="border border-border bg-card/40 backdrop-blur-sm p-6 md:p-10 hover:border-primary/40 transition-all duration-500 relative overflow-hidden group/card"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6">
                  <div>
                    <h4 className="font-display font-semibold text-2xl md:text-3xl text-foreground">Engineering Intern</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-medium text-lg hover:underline cursor-pointer">NimbusPost</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1 border border-border">
                        <MapPin size={12} className="text-primary" /> Onsite [gurugram]
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-card px-4 py-2 border border-border rounded-lg self-start md:self-center">
                    <Calendar size={14} className="text-primary" />
                    <span>May 2026 – August 2026 (3 Months)</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground md:text-lg leading-relaxed mb-6">
                  As an Engineering Intern at NimbusPost, I worked on AI and logistics-focused solutions to improve operational efficiency and shipment success rates.
                </p>

                {/* Featured Projects Highlight */}
                <div className="mb-8">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <Cpu size={14} className="text-primary" /> Featured Systems Developed
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project 1 */}
                    <div className="bg-background/40 border border-border hover:border-accent/40 rounded-lg p-5 transition-all duration-300 group/proj hover:bg-background/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                        <h6 className="font-display font-medium text-foreground group-hover/proj:text-accent transition-colors">Address Validation System</h6>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Validates, standardizes, and enhances delivery addresses to reduce delivery failures and improve overall logistics data quality.
                      </p>
                    </div>
                    {/* Project 2 */}
                    <div className="bg-background/40 border border-border hover:border-primary/40 rounded-lg p-5 transition-all duration-300 group/proj hover:bg-background/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <h6 className="font-display font-medium text-foreground group-hover/proj:text-primary transition-colors">RTO Prediction System</h6>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Uses machine learning models to identify high-risk shipments before dispatch, helping reduce Return-to-Origin rates and operational costs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Contributions */}
                <div className="mb-8">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <Workflow size={14} className="text-primary" /> Key Contributions
                  </h5>
                  <ul className="space-y-3">
                    {[
                      "Developed an Address Validation System that validates, standardizes, and enhances delivery addresses to reduce delivery failures and improve data quality.",
                      "Built an RTO (Return-to-Origin) Prediction System using machine learning to identify high-risk shipments before dispatch, helping reduce return rates and operational costs.",
                      "Performed data preprocessing, feature engineering, model training, and evaluation on logistics datasets.",
                      "Collaborated with engineering teams to integrate intelligent solutions into existing workflows.",
                      "Focused on building scalable, production-oriented systems with accuracy and performance in mind."
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex gap-3 text-sm md:text-base text-muted-foreground leading-relaxed items-start">
                        <span className="text-primary mt-1.5 shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Technologies Used</h5>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "Git", "Data Analysis"].map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1 bg-secondary text-secondary-foreground uppercase tracking-wider font-semibold border border-border hover:border-primary/30 transition-colors duration-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </div>
          </div>

          {/* Achievements & Milestones */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-8 flex items-center gap-2">
              <Trophy size={16} /> Achievements & Milestones
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((item, i) => (
                <AchievementCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;

