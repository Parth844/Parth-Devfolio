import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const ParticleSystem = () => {
  const ref = useRef<THREE.Points>(null);

  // Generate 5000 particles in a sphere
  const sphere = useMemo(() => {
    const particleCount = 2000;
    const array = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    return array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="hsl(199, 89%, 48%)"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
