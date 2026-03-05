import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from "framer-motion";
import { ArrowDown, Send, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Sparkles, PresentationControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const TitleSparkles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[2px] h-[2px] bg-primary rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: '0 0 10px 1px rgba(0, 255, 128, 0.8)',
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
          y: [0, -30],
          x: [0, (Math.random() - 0.5) * 30],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const roles = ["AI/ML Developer", "UI/UX Designer", "Software Developer", "AR/VR Explorer"];

// Individual Laser Beam Component
const LaserBeam = ({ direction, onComplete }: { direction: THREE.Vector3, onComplete: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());
  const speed = 50;
  const lifetime = 1000; // 1 second

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = Date.now() - startTime.current;

    if (elapsed > lifetime) {
      onComplete();
      return;
    }

    // Move laser in its direction
    meshRef.current.position.addScaledVector(direction, speed * 0.016);

    // Fade out as it ages
    const opacity = 1 - (elapsed / lifetime);
    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} rotation-z={Math.atan2(direction.y, direction.x) - Math.PI / 2}>
      <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
      <meshBasicMaterial color="#ff0000" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      {/* Laser Glow */}
      <pointLight color="#ff0000" intensity={3} distance={1.5} />
    </mesh>
  );
};

const Hotspot = ({ label, onClick, position }: { label: string, onClick: () => void, position: [number, number, number] }) => (
  <Html position={position} center distanceFactor={10}>
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex flex-col items-center justify-center p-4 cursor-pointer"
    >
      {/* Subtle Outer Glow */}
      <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/5 animate-pulse blur-lg group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute inset-0 w-8 h-8 m-auto rounded-full bg-primary/10 animate-ping opacity-30" />

      {/* Elegant Light Gradient Button */}
      <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white via-primary/30 to-primary/10 shadow-[0_0_15px_rgba(255,255,255,0.3),0_0_5px_rgba(255,255,255,0.1),inset_0_0_2px_rgba(255,255,255,0.5)] border border-white/20 transition-all duration-500 group-hover:scale-125" />

      {/* Subtle Label HUD - Always visible on mobile */}
      <div className="mt-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 shadow-lg">
        <span className="text-[10px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-white/90 whitespace-nowrap">
          {label}
        </span>
      </div>
    </button>
  </Html>
);

function StarfighterModel({ isFixed, scrollScale = 1, targetBaseRotation = [0, 0, 0], currentView = 'front', onViewChange, ...props }: { isFixed: boolean, scrollScale?: number, targetBaseRotation?: [number, number, number], currentView?: string, onViewChange?: (view: any) => void } & any) {
  const { scene } = useGLTF("/star_wars_ship.glb");
  const [scale, setScale] = useState<[number, number, number]>([4, 4, 4]);
  const groupRef = useRef<THREE.Group>(null);
  const baseRotationRef = useRef(new THREE.Euler(0, 0, 0));
  const [lasers, setLasers] = useState<{ id: number, dir: THREE.Vector3 }[]>([]);
  const lastFireTime = useRef(0);
  const fireRate = 120; // ms

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? [2.0, 2.0, 2.0] : [5.5, 5.5, 5.5]);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    baseRotationRef.current.x = THREE.MathUtils.lerp(baseRotationRef.current.x, targetBaseRotation[0], 0.05);
    baseRotationRef.current.y = THREE.MathUtils.lerp(baseRotationRef.current.y, targetBaseRotation[1], 0.05);
    baseRotationRef.current.z = THREE.MathUtils.lerp(baseRotationRef.current.z, targetBaseRotation[2], 0.05);

    if (isFixed) {
      const isFront = currentView === 'front';
      const targetRotationX = isFront ? (-state.pointer.y * 0.4 + baseRotationRef.current.x) : baseRotationRef.current.x;
      const targetRotationY = isFront ? (state.pointer.x * 0.4 + baseRotationRef.current.y) : baseRotationRef.current.y;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);

      const targetPosX = state.pointer.x * 0.5;
      const targetPosY = (state.pointer.y * 0.5);

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);

      groupRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;

      const px = state.pointer.x;
      const py = state.pointer.y;
      const mag = Math.sqrt(px * px + py * py);

      if (!groupRef.current.userData.hasFired && mag > 0.7) {
        groupRef.current.userData.hasFired = true;
        const dir = new THREE.Vector3();
        const angle = Math.atan2(py, px);
        const quantizedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        dir.set(Math.cos(quantizedAngle), Math.sin(quantizedAngle), 0).normalize();
        const count = Math.floor(Math.random() * 3) + 1;
        const newLasers = Array.from({ length: count }).map((_, i) => ({
          id: Date.now() + Math.random() + i,
          dir: dir.clone()
        }));
        setLasers(prev => [...prev.slice(-10), ...newLasers]);
      } else if (mag < 0.5) {
        groupRef.current.userData.hasFired = false;
      }
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseRotationRef.current.x, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotationRef.current.y, 0.05);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
    }
  });

  return (
    <group ref={groupRef} scale={scrollScale}>
      {/* Wrap everything in a responsive scale group so points stay attached on mobile */}
      <group scale={scale}>
        <Center>
          <primitive object={scene} rotation={[0, 0, 0]} {...props} />
        </Center>

        <group position={[0, 0.04, -0.33]}>
          <Sparkles count={200} scale={[0.1, 0.1, 0.4]} size={1.5} speed={4} color="#ff3300" opacity={1} />
          <pointLight intensity={30} distance={1} color="#ff3300" />
        </group>

        {lasers.map(laser => (
          <LaserBeam key={laser.id} direction={laser.dir} onComplete={() => setLasers(prev => prev.filter(l => l.id !== laser.id))} />
        ))}

        {/* Dynamic View Hotspots (Normalized coordinates) */}
        {isFixed && (
          <group>
            {currentView === 'front' && (
              <>
                <Hotspot label="Left" position={[-0.64, 0, 0]} onClick={() => onViewChange?.('left')} />
                <Hotspot label="Right" position={[0.64, 0, 0]} onClick={() => onViewChange?.('right')} />
                <Hotspot label="Top" position={[0, 0.33, 0]} onClick={() => onViewChange?.('top')} />
              </>
            )}

            {currentView === 'back' && (
              <>
                <Hotspot label="Left" position={[-0.64, 0, 0]} onClick={() => onViewChange?.('left')} />
                <Hotspot label="Right" position={[0.64, 0, 0]} onClick={() => onViewChange?.('right')} />
                <Hotspot label="Top" position={[0, 0.33, 0]} onClick={() => onViewChange?.('top')} />
                <Hotspot label="Front" position={[0, 0.09, 0.73]} onClick={() => onViewChange?.('front')} />
              </>
            )}

            {(currentView === 'left' || currentView === 'right' || currentView === 'top') && (
              <>
                <Hotspot label="Front" position={[0, 0.09, 0.64]} onClick={() => onViewChange?.('front')} />
                <Hotspot label="Rear" position={[0, 0.18, -0.73]} onClick={() => onViewChange?.('back')} />
              </>
            )}
          </group>
        )}
      </group>
    </group>
  );
}

const HeroStarStreaks = ({ progress }: { progress: number }) => {
  const count = 400;
  const [lines, colors] = useMemo(() => {
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    const colorPalette = ["#00f3ff", "#ffffff", "#0078ff", "#a5f3fc", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * -1000;
      const length = 40 + Math.random() * 60;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - length;
      const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      colors[i * 6] = color.r;
      colors[i * 6 + 1] = color.g;
      colors[i * 6 + 2] = color.b;
      colors[i * 6 + 3] = color.r * 0.1;
      colors[i * 6 + 4] = color.g * 0.1;
      colors[i * 6 + 5] = color.b * 0.1;
    }
    return [positions, colors];
  }, []);

  const meshRef = useRef<THREE.LineSegments>(null);
  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 5;
    for (let i = 0; i < count; i++) {
      pos[i * 6 + 2] += speed;
      pos[i * 6 + 5] += speed;
      if (pos[i * 6 + 2] > 100) {
        pos[i * 6 + 2] = -1000;
        pos[i * 6 + 5] = -1060;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={Math.min(0.3, progress) * (1 - Math.pow(progress, 15))} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
};

useGLTF.preload("/star_wars_ship.glb");

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [isModelFixed, setIsModelFixed] = useState(false);
  const [modelScaleProgress, setModelScaleProgress] = useState(0);
  const [activeView, setActiveView] = useState<'front' | 'back' | 'left' | 'right' | 'top'>('front');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const viewRotations: Record<string, [number, number, number]> = {
    front: [0.2, 0, 0], // Slight tilt downwards
    back: [0, Math.PI, 0],
    left: [0, -Math.PI / 2, 0],
    right: [0, Math.PI / 2, 0],
    top: [Math.PI / 2, 0, 0],
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Sequence 1: Intro Text Entrance
    tl.fromTo(introRef.current,
      { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
    )
      // Sequence 2: Reveal rest of Hero UI
      .fromTo(".hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1.5, transformOrigin: "left center" }, "-=0.5")
      .fromTo(".hero-tag", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 }, "-=1.0")
      .fromTo(".hero-role", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.8")
      .fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

    if (textRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // Increased scroll distance to slow down the progress
          scrub: 2.5,    // Smoother and slower follow speed

          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const scaleStart = 0.05;
            const scaleEnd = 0.85;
            const progress = self.progress;
            const clampedProgress = gsap.utils.clamp(scaleStart, scaleEnd, progress);
            const newScale = gsap.utils.mapRange(scaleStart, scaleEnd, 0, 1, clampedProgress);
            setModelScaleProgress(newScale);
            setIsModelFixed(progress > scaleEnd);

            // Intro text scroll behavior
            if (introRef.current) {
              if (progress > 0) {
                // If the user scrolls while entrance is playing, snap to end of entrance
                if (tl.isActive()) tl.progress(1);

                // Scrub the text away over the first 15% of scroll
                const introScroll = gsap.utils.clamp(0, 1, progress / 0.15);
                gsap.set(introRef.current, {
                  opacity: 1 - introScroll,
                  y: -introScroll * 400, // Move upwards as it fades
                  scale: 1 + introScroll * 0.2, // Expand slightly
                  filter: `blur(${introScroll * 15}px)`
                });
              } else if (progress === 0 && !tl.isActive()) {
                // Reset to fully visible when scrolled all the way back up
                gsap.set(introRef.current, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
              }
            }
          }
        }
      });
    }
  }, { scope: sectionRef });

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 xl:px-32 pb-2 md:pb-4 overflow-hidden bg-background border-b border-border z-20">
      <div className="absolute inset-x-0 top-0 h-px bg-border/40" />
      <div className="absolute inset-y-0 left-[10%] w-px bg-border/20 hidden md:block" />
      <div className="absolute inset-y-0 right-[10%] w-px bg-border/20 hidden md:block" />

      {/* Main Intro Text Overlay */}
      <div
        ref={introRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 text-center opacity-0"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          Turning Ideas into <span className="text-primary italic">Intelligent</span> Products
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light tracking-[0.3em] uppercase max-w-2xl">
          AI, design, and technology working together.
        </p>
      </div>

      <div className="middle-3d-model absolute inset-0 z-0 pointer-events-auto flex items-center justify-center overflow-hidden transition-opacity duration-500" style={{ opacity: modelScaleProgress > 0.01 ? 1 : 0 }}>
        <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 15] }} className="w-full h-full">
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={1.5 + (modelScaleProgress * 2)} />
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2 + (modelScaleProgress * 10)} color="#ffffff" />
          <spotLight position={[0, 5, 5]} angle={0.3} penumbra={0.8} intensity={modelScaleProgress * 15} color="#00f3ff" />
          <pointLight position={[-10, -10, -10]} intensity={1 + (modelScaleProgress * 3)} />
          <Stars radius={100} depth={50} count={Math.floor(modelScaleProgress * 5000)} factor={4} saturation={0} fade speed={1} />
          <group position={[0, isMobile ? 1.8 : 0, 0]}>
            <HeroStarStreaks progress={modelScaleProgress} />
          </group>
          <PresentationControls global cursor={false} speed={4} config={{ mass: 1, tension: 1000 }} snap={{ mass: 2, tension: 1500 }} rotation={[0, 0, 0]} polar={[-Math.PI / 2, Math.PI / 2]} azimuth={[-Math.PI, Math.PI]}>
            <group position={[0, isMobile ? 1.8 : 0, 0]}>
              <StarfighterModel isFixed={isModelFixed} scrollScale={modelScaleProgress} targetBaseRotation={viewRotations[activeView]} currentView={activeView} onViewChange={setActiveView} />
            </group>
          </PresentationControls>
        </Canvas>
      </div>

      <div ref={textRef} className="relative z-10 w-full max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end pointer-events-none">
        <div className="md:col-span-3 pb-8 hero-tag hidden md:block">
          <div className="hero-line h-[2px] w-12 bg-primary mb-6" />
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mb-2">Portfolio v3.0</p>
          <p className="text-foreground text-xl md:text-2xl font-semibold">Parth Tyagi</p>
        </div>
        <div className="md:col-span-9 relative border-border min-h-0 md:min-h-[400px] flex flex-col justify-end">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 border-t border-border pt-6 md:pt-8 relative z-10">
            <div className="hero-role mb-6 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
              <div className="hero-tag md:hidden mb-4 flex flex-col items-center">
                <div className="hero-line h-[2px] w-12 bg-primary mb-4" />
                <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mb-2">Portfolio v3.0</p>
                <p className="text-foreground text-xl font-semibold">Parth Tyagi</p>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground h-8 font-sans font-light tracking-wide flex items-center justify-center md:justify-start">
                <span className="text-foreground font-medium mr-2">Role:</span> {text}<span className="animate-pulse text-primary ml-1">|</span>
              </p>
            </div>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="h-fit w-full md:w-auto px-8 py-4 bg-primary text-black font-semibold text-sm uppercase tracking-wider hover:bg-white transition-colors duration-300 pointer-events-auto">View Projects</button>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a href="/Parth_Tyagi_Resume.pdf" download="Parth_Tyagi_Resume.pdf" className="flex-1 md:flex-none px-4 md:px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"><Download size={16} /> Resume</a>
                <a href="mailto:Parthtyagi520@gmail.com" className="flex-1 md:flex-none px-4 md:px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"><Send size={16} /> Contact</a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce text-muted-foreground hover:text-primary transition-colors hidden md:block relative z-10">
          <ArrowDown size={32} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
