import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollMorphHero from "../components/ui/ScrollMorphHero";

interface HeroProps {
  data: any;
  projects?: any[];
  onSelectProject?: (project: any) => void;
  isEditor: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, projects, onSelectProject, isEditor }) => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Fallback
  const safeContent = data || {
    label: "digital atelier",
    title_start: "N&A",
    description: "Wij bouwen digitale ervaringen die raken.",
  };

  const fullTitle = `${safeContent.title_start || ''}`.trim();

  if (isEditor) {
    return (
      <section className="relative h-screen bg-[#FAFAFA] overflow-hidden">
        <ScrollMorphHero
          title={fullTitle}
          subtitle={safeContent.description}
          label={safeContent.label}
          projects={projects}
          onProjectClick={onSelectProject}
        />
      </section>
    );
  }

  return (
    <section ref={targetRef} className="relative h-[300vh] -mb-[20vh]">
      <div className="sticky top-0 h-screen z-40 overflow-hidden pointer-events-none">
        <ScrollMorphHero
          title={fullTitle}
          subtitle={safeContent.description}
          label={safeContent.label}
          scrollProgress={scrollYProgress}
          projects={projects}
          onProjectClick={onSelectProject}
        />
      </div>
    </section>
  );
};
