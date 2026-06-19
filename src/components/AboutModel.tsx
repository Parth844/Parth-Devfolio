import { Canvas } from "@react-three/fiber";
import InteractiveModel from "./ui/InteractiveModel";

// Decorative background model for the About section. Split into its own lazy chunk and
// mounted only when the section nears the viewport, so its WebGL context doesn't spin up
// during the initial above-the-fold paint.
const AboutModel = () => (
  <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
    <InteractiveModel color="hsl(151, 55%, 52%)" distort={0.4} speed={1} />
  </Canvas>
);

export default AboutModel;
