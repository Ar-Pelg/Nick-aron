import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealText } from "../components/RevealText";

interface HeroProps {
  data: any;
  isEditor: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, isEditor }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Fallback
  const safeContent = data || {
    hero_label: "Laden...",
    hero_title_start: "Laden...",
    hero_title_italic: "",
    hero_description: "",
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAFA] pt-20">
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[20%] right-[10%] w-[30vw] h-[40vh] bg-neutral-100 grayscale opacity-50 overflow-hidden will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
            loading="eager"
            alt="Architecture 1"
          />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[10%] left-[5%] w-[25vw] h-[35vh] bg-neutral-200 grayscale opacity-50 overflow-hidden will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
            loading="eager"
            alt="Architecture 2"
          />
        </motion.div>
      </div>

      <div className="relative z-20 text-center max-w-5xl px-6">
        {/* --- LABEL --- */}
        <RevealText className="inline-block" delay={0.2} disabled={isEditor}>
          <span
            className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white"
            data-cms-bind="#hero.label"
            suppressContentEditableWarning={true}
          >
            {safeContent.label}
          </span>
        </RevealText>

        {/* --- TITEL --- */}
        <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-neutral-900 mb-8 tracking-tight cursor-default">
          <RevealText delay={0.3} disabled={isEditor} as="span">
            <span
              data-cms-bind="#hero.title_start"
              suppressContentEditableWarning={true}
            >
              {safeContent.title_start}
            </span>
          </RevealText>
          <RevealText delay={0.4} disabled={isEditor} as="span">
            <span
              className="italic text-neutral-400 font-light ml-2 md:ml-4"
              data-cms-bind="#hero.title_italic"
              suppressContentEditableWarning={true}
            >
              {safeContent.title_italic}
            </span>
          </RevealText>
        </h1>

        {/* --- OMSCHRIJVING --- */}
        {isEditor ? (
          <p
            suppressContentEditableWarning={true}
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
            data-cms-bind="#hero.description"
          >
            {safeContent.description}
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {safeContent.description}
          </motion.p>
        )}

        {/* --- SCROLL LIJN --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex justify-center"
        >
          <div className="h-16 w-[1px] bg-neutral-200 overflow-hidden">
            <motion.div
              animate={{ y: [-64, 64] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full h-full bg-neutral-900"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
