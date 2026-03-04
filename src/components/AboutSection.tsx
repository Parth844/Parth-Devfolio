import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Brain, Palette, Code } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import InteractiveModel from "./ui/InteractiveModel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: "2023", title: "B.Tech Computer Science", desc: "Started degree at ABES Institute of Technology." },
  { year: "2024", title: "Independent Developer", desc: "Architected full-stack AR applications and trained high-performance face recognition pipelines." },
  { year: "2025", title: "Hackathon Winner", desc: "Secured 1st in Build With Gemini and 3rd at Delhi University for AR/VR innovation." },
  { year: "Present", title: "AI/ML Innovator", desc: "Building scalable AI solutions and mentoring developers." },
];

const AboutSection = () => {
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
    <section id="about" className="border-b border-border bg-background relative z-10" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-2 relative">

        {/* Left Column - Pinned */}
        <div
          ref={leftColRef}
          className="md:col-span-1 p-8 md:p-16 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-center relative overflow-hidden"
        >
          {/* Subtle 3D background integrated into the pinned section */}
          <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <InteractiveModel color="hsl(151, 55%, 52%)" distort={0.4} speed={1} />
            </Canvas>
          </div>

          <div className="relative z-10" ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">About Me</p>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8 text-foreground">
                Creative<br />
                <span className="text-primary">Engineering</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-sans font-light">
                I'm Parth Tyagi — an AI/ML developer who treats code like a design medium.
                I focus on building resilient, gorgeous interfaces powered by Deep Learning, spatial computing, and an obsessive attention to detail.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content */}
        <div ref={rightColRef} className="md:col-span-1 flex flex-col">

          {/* Skills Grid - Bento Sub-grid */}
          <div className="grid grid-cols-2 border-b border-border">
            {[
              { icon: Code, label: "Core Logic", desc: "Python, C++, JS" },
              { icon: Brain, label: "AI/CV", desc: "OpenCV, Deep Learning" },
              { icon: Sparkles, label: "AR & 3D", desc: "Unity, Blender, ARKit" },
              { icon: Palette, label: "UI/UX", desc: "Figma, Prototyping" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-8 md:p-12 border-border hover:bg-card transition-colors duration-500 flex flex-col justify-center
                  ${i % 2 === 0 ? "border-r" : ""} 
                  ${i < 2 ? "border-b" : ""}
                `}
                style={{ minHeight: "250px" }}
              >
                <item.icon className="mb-6 text-primary" size={32} strokeWidth={1.5} />
                <h3 className="font-display font-bold text-xl mb-2 text-foreground">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline Section */}
          <div className="p-8 md:p-16 flex-grow flex flex-col justify-center min-h-screen">
            <h3 className="font-display text-2xl font-bold uppercase mb-12 tracking-wider">The Journey</h3>

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="relative pl-8 border-l border-border hover:border-primary transition-colors duration-300"
                >
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-border" />
                  <span className="text-primary font-display font-bold text-lg leading-none block mb-2">{item.year}</span>
                  <h4 className="font-display font-semibold text-xl mb-2 text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
