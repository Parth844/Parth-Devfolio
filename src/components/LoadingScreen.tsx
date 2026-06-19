import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";



const StarStreaks = () => {
    const count = 600;
    const [lines, colors] = useMemo(() => {
        const positions = new Float32Array(count * 6);
        const colors = new Float32Array(count * 6);
        const colorPalette = ["#DA7756", "#ffffff", "#E8A87C", "#f5d0b5", "#ffffff"];

        for (let i = 0; i < count; i++) {
            const radius = 3 + Math.random() * 25;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.random() * 1000 - 500;
            const length = 40 + Math.random() * 60;

            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z;

            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y;
            positions[i * 6 + 5] = z + length; // Tail goes further positive (closer)

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

    useFrame((state) => {
        if (!meshRef.current) return;

        const elapsed = state.clock.elapsedTime;
        // Reversed Surge: moving away from camera (negative Z)
        let speed = -0.6;
        if (elapsed > 4.5) {
            const t = Math.min((elapsed - 4.5) / 3, 1);
            speed = THREE.MathUtils.lerp(-0.6, -50, t * t);
        }

        // Final surge boost at 97% completion (7.275s)
        if (elapsed > 7.275) {
            speed *= 1.5;
        }

        const pos = meshRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            pos[i * 6 + 2] += speed;
            pos[i * 6 + 5] += speed;

            // Loop back from infinity
            if (pos[i * 6 + 2] < -1000) {
                pos[i * 6 + 2] = 200;
                pos[i * 6 + 5] = 260;
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={lines.length / 3}
                    array={lines}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </lineSegments>
    );
};

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
    const [loadingText, setLoadingText] = useState("Initializing Systems...");

    useEffect(() => {
        const timers = [
            setTimeout(() => setLoadingText("Synchronizing Neural Core..."), 2000),
            setTimeout(() => setLoadingText("Loading Assets..."), 4000),
            setTimeout(() => setLoadingText("Finalizing..."), 6000),
            setTimeout(() => onFinished(), 7500)
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [onFinished]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
                    <color attach="background" args={["#000"]} />
                    <ambientLight intensity={0.5} />
                    <StarStreaks />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                </Canvas>
            </div>

            <div className="relative z-10 text-center px-8">
                {/* Logo / Name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-10"
                >
                    <p className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white">
                        PARTH <span style={{ color: "#DA7756" }}>TYAGI</span>
                    </p>
                    <p className="text-xs tracking-[0.4em] uppercase text-white/30 mt-2">
                        AI · Design · Technology
                    </p>
                </motion.div>

                <motion.div
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                >
                    <p className="font-display text-sm font-semibold tracking-[0.3em] uppercase"
                       style={{ color: "#DA7756" }}>
                        {loadingText}
                    </p>
                </motion.div>

                {/* Loading Bar */}
                <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mx-auto">
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(90deg, #DA7756, #E8A87C)" }}
                        initial={{ left: "-100%" }}
                        animate={{ left: "0%" }}
                        transition={{ duration: 7.5, ease: "easeIn" }}
                    />
                    {/* Shimmer */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ left: ["-20%", "120%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
