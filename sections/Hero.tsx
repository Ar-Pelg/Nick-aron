import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealText } from "../components/RevealText";
import contentData from "../content/home.json";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // State voor de content
  const [content, setContent] = useState(
    contentData || {
      hero_label: "Digital Atelier",
      hero_title_start: "Wij bouwen digitale",
      hero_title_italic: "monumenten.",
      hero_description: "Nick & Aron combineren...",
    }
  );

  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // 1. Check of we in de editor zitten (voor de weergave van animaties)
    const checkEditor = () => {
      const inCloudCannon =
        typeof window !== "undefined" && (window as any).CloudCannon;
      if (inCloudCannon) {
        setIsEditor(true);
      }
    };
    checkEditor();

    // Check nogmaals na een korte tijd (voor de zekerheid)
    setTimeout(checkEditor, 500);

    // 2. DIT IS HET BELANGRIJKE STUK VOOR LIVE UPDATES
    // Deze functie zorgt dat als jij links typt, rechts direct update.
    const handleCloudCannonUpdate = (e: any) => {
      if (e.detail && e.detail.CloudCannon) {
        setContent(e.detail.CloudCannon);
        setIsEditor(true);
      }
    };

    // We zetten de luisteraar AAN
    document.addEventListener("cloudcannon:update", handleCloudCannonUpdate);
    document.addEventListener("cloudcannon:load", checkEditor);

    return () => {
      document.removeEventListener(
        "cloudcannon:update",
        handleCloudCannonUpdate
      );
      document.removeEventListener("cloudcannon:load", checkEditor);
    };
  }, []);

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
        {isEditor ? (
          <span
            className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white cursor-text"
            data-cms-bind="#hero_label"
          >
            {content.hero_label}
          </span>
        ) : (
          <RevealText className="inline-block" delay={0.2}>
            <span className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white">
              {content.hero_label}
            </span>
          </RevealText>
        )}

        {/* --- TITEL --- */}
        <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-neutral-900 mb-8 tracking-tight cursor-default">
          {isEditor ? (
            <>
              <span data-cms-bind="#hero_title_start">
                {content.hero_title_start}
              </span>
              <span
                className="italic text-neutral-400 font-light ml-2 md:ml-4"
                data-cms-bind="#hero_title_italic"
              >
                {content.hero_title_italic}
              </span>
            </>
          ) : (
            <>
              <RevealText delay={0.3}>
                <span>{content.hero_title_start}</span>
              </RevealText>
              <RevealText delay={0.4}>
                <span className="italic text-neutral-400 font-light ml-2 md:ml-4">
                  {content.hero_title_italic}
                </span>
              </RevealText>
            </>
          )}
        </h1>

        {/* --- OMSCHRIJVING --- */}
        {isEditor ? (
          <p
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
            data-cms-bind="#hero_description"
          >
            {content.hero_description}
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {content.hero_description}
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
