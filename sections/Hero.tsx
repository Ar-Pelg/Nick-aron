import React from "react";
import ScrollMorphHero from "../components/ui/ScrollMorphHero";

interface HeroProps {
  data: any;
  isEditor: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, isEditor }) => {
  // Fallback
  const safeContent = data || {
    hero_label: "Laden...",
    hero_title_start: "Nick & Aron",
    hero_title_italic: "Digital Atelier",
    hero_description: "Wij bouwen digitale ervaringen die raken.",
  };

  const fullTitle = `${safeContent.hero_title_start} ${safeContent.hero_title_italic}`;

  if (isEditor) {
    // Return a simpler view for the editor to avoid breaking CloudCannon's visual editing
    // or simply render the component but disable complex scroll locking if possible.
    // For now, let's render the component but acknowledge that 'virtual scroll' might interfere.
    return (
      <section className="relative h-screen bg-[#FAFAFA] overflow-hidden">
        <ScrollMorphHero
          title={fullTitle}
          subtitle={safeContent.hero_description}
          label={safeContent.hero_label}
        />
      </section>
    );
  }

  return (
    <section className="relative h-screen bg-[#FAFAFA] overflow-hidden">
      <ScrollMorphHero
        title={fullTitle}
        subtitle={safeContent.hero_description}
        label={safeContent.hero_label}
      />
    </section>
  );
};
