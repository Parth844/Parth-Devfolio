import { motion } from "framer-motion";

const items = [
  "AI / ML Developer",
  "Computer Vision",
  "AR / VR Builder",
  "Deep Learning",
  "React · TypeScript",
  "Python · FastAPI",
  "Unity · ARCore",
  "Figma · Design",
  "Hackathon Winner",
  "Open Source",
];

const MarqueeStrip = ({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) => {
  const doubled = [...items, ...items];

  return (
    <div className={`relative overflow-hidden border-y border-border py-4 bg-secondary/30 ${className}`}>
      <div
        className="marquee-track"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: "25s",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap"
          >
            <span className="text-primary text-lg leading-none">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
