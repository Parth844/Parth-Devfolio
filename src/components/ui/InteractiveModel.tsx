import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveModelProps {
    color?: string;
    distort?: number;
    speed?: number;
}

const InteractiveModel = ({ color = "hsl(199, 89%, 48%)", distort = 0.4, speed = 2 }: InteractiveModelProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

            // Gentle mouse interaction mapping coordinates from -1 to 1
            const targetX = (state.pointer.x * Math.PI) / 4;
            const targetY = (state.pointer.y * Math.PI) / 4;

            meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
            meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="hsl(265, 80%, 60%)" />

            <Sphere ref={meshRef} args={[1.5, 64, 64]}>
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.8}
                    roughness={0.2}
                    distort={distort}
                    speed={speed}
                    transparent
                    opacity={0.85}
                />
            </Sphere>
        </Float>
    );
};

export default InteractiveModel;
