import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import MarqueeStrip from "@/components/MarqueeStrip";

const ParticleBackground = lazy(() => import("@/components/ParticleBackground"));

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onFinished={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <SmoothScroll>
          <div className="min-h-screen bg-background text-foreground">
            <Suspense fallback={null}>
              <ParticleBackground />
            </Suspense>
            <ScrollProgress />
            <CursorGlow />
            <Navbar />
            <main>
              <HeroSection />
              <MarqueeStrip />
              <AboutSection />
              <MarqueeStrip reverse />
              <SkillsSection />
              <ProjectsSection />
              <MarqueeStrip />
              <ExperienceSection />
              <ContactSection />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      )}
    </>
  );
};

export default Index;
