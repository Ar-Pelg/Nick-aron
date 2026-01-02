import React, { useRef, Suspense } from 'react';
import { useScroll } from 'framer-motion';
// import { ThreeCityScene } from '../three/ThreeCityScene'; // Removed static import
import { RevealText } from '../components/RevealText';

// Dynamic import: Only load the heavy 3D code when this component is actually needed/rendered
// Dynamic import removed - lifted to App.tsx

interface AboutSectionProps {
  data: any;
  isEditor: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data, isEditor }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const safeData = data || {
    philosophy_title: "Filosofie",
    philosophy_quote_start: "Wij geloven dat digitale perfectie ontstaat waar",
    philosophy_quote_highlight1: "reductie",
    philosophy_quote_mid: "en",
    philosophy_quote_highlight2: "expressie",
    philosophy_quote_end: "elkaar ontmoeten.",
    grid_items: []
  };

  return (
    <section ref={targetRef} className="bg-transparent h-[250vh] relative" id="studio">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background 3D Scene - Now Global in App.tsx */}

        {/* Overlay Content - Scrolling over the scene */}
        <div className={`absolute inset-0 z-10 ${!isEditor ? 'pointer-events-none' : ''}`}>
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-end pb-12">
            {/* Content can be placed here if needed */}
          </div>
        </div>
      </div>

      {/* Spacer content to allow scrolling 'past' the initial view */}
      <div className={`relative z-10 text-white px-6 md:px-16 py-32 flex flex-col items-center justify-center min-h-screen ${!isEditor ? 'pointer-events-none' : ''}`}>

        {/* GLASS CARD 1: Philosophy */}
        <div className={`max-w-4xl mx-auto mb-24 p-12 bg-[#161617]/40 backdrop-blur-md border border-white/10 shadow-2xl ${!isEditor ? 'pointer-events-auto' : ''}`}>
          <RevealText disabled={isEditor}>
            <h4
              className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8 border-b border-white/10 pb-4 inline-block"
            >
              {safeData.philosophy_title}
            </h4>
          </RevealText>
          <div className="font-serif text-4xl md:text-6xl leading-tight text-white drop-shadow-lg">
            "<span>{safeData.philosophy_quote_start}</span> <span className="text-neutral-400 italic">{safeData.philosophy_quote_highlight1}</span> <span>{safeData.philosophy_quote_mid}</span> <span className="text-neutral-400 italic">{safeData.philosophy_quote_highlight2}</span> <span>{safeData.philosophy_quote_end}</span>"
          </div>
        </div>


      </div>
    </section >
  );
};