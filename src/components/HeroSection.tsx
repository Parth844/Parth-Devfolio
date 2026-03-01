import { useEffect, useState, useRef } from "react";
import { ArrowDown, Send, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const roles = ["AI/ML Developer", "UI/UX Designer", "Software Developer", "AR/VR Explorer"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // High-impact, stark Entry Animation
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.5, transformOrigin: "left center" })
      .fromTo(".hero-tag", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 }, "-=1.0")
      .fromTo(".hero-title-line", { y: 100, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 1.2 }, "-=0.8")
      .fromTo(".hero-role", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.8")
      .fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

    // Strict Scroll Scrubbing
    gsap.to(textRef.current, {
      y: "30%",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: sectionRef });

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setRoleIndex((i) => (i + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden bg-background border-b border-border">

      {/* Absolute strict grid lines mimicking Shopify Editions */}
      <div className="absolute inset-x-0 top-0 h-px bg-border/40" />
      <div className="absolute inset-y-0 left-[10%] w-px bg-border/20 hidden md:block" />
      <div className="absolute inset-y-0 right-[10%] w-px bg-border/20 hidden md:block" />

      <div ref={textRef} className="relative z-10 w-full max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end">

        {/* Left Tracking Column */}
        <div className="md:col-span-3 pb-8 hero-tag">
          <div ref={lineRef} className="h-[2px] w-12 bg-primary mb-6" />
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mb-2">
            Portfolio v3.0
          </p>
          <p className="text-foreground text-sm font-semibold">
            Parth Tyagi
          </p>
        </div>

        {/* Massive Central Typography */}
        <div className="md:col-span-9">
          <h1 className="font-display text-5xl sm:text-7xl md:text-[7rem] lg:text-[8rem] font-bold leading-[0.9] tracking-tighter mb-8 text-foreground uppercase">
            <div className="overflow-hidden pb-2"><div className="hero-title-line">Designing</div></div>
            <div className="overflow-hidden pb-2"><div className="hero-title-line">The Future</div></div>
            <div className="overflow-hidden"><div className="hero-title-line text-primary">With AI</div></div>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-border pt-8">
            <div className="hero-role">
              <p className="text-xl md:text-2xl text-muted-foreground h-8 font-sans font-light tracking-wide">
                <span className="text-foreground font-medium">Role:</span> {text}
                <span className="animate-pulse text-primary ml-1">|</span>
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-primary text-black font-semibold text-sm uppercase tracking-wider hover:bg-white transition-colors duration-300"
              >
                View Projects
              </button>
              <a
                href="/Parth_Tyagi_Resume.pdf"
                download="Parth_Tyagi_Resume.pdf"
                className="px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={16} /> Resume
              </a>
              <a
                href="mailto:Parthtyagi520@gmail.com"
                className="px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} /> Contact
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 animate-bounce text-muted-foreground hover:text-primary transition-colors hidden md:block">
          <ArrowDown size={32} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
