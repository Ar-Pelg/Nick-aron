import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollMorphHero from "../components/ui/ScrollMorphHero";

interface HeroProps {
  data: any;
  isEditor: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, isEditor }) => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Fallback
  const safeContent = data || {
    label: "digital atelier",
    title_start: "Nick & Aron",
    title_italic: "",
    description: "Wij bouwen digitale ervaringen die raken.",
  };

  const fullTitle = `${safeContent.title_start || ''} ${safeContent.title_italic || ''}`.trim();

  if (isEditor) {
    return (
      <section className="relative h-screen bg-[#FAFAFA] overflow-hidden">
        <ScrollMorphHero
          title={fullTitle}
          subtitle={safeContent.description}
          label={safeContent.label}
        />
      </section>
    );
  }

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#FAFAFA]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ScrollMorphHero
          title={fullTitle}
          subtitle={safeContent.description}
          label={safeContent.label}
          scrollProgress={scrollYProgress}
        />
      </div>
    </section>
  );
};
