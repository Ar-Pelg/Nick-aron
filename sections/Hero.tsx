import React, { useState, useEffect } from "react"; // 1. Importeer useState en useEffect
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealText } from "../components/RevealText";
import contentData from "../../content/home.json";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // 2. Maak er 'state' van in plaats van een vaste variabele
  // Dit zorgt dat React weet: "Als deze data verandert, moet ik het scherm verversen"
  const [content, setContent] = useState(
    contentData || {
      hero_label: "Digital Atelier",
      hero_title_start: "Wij bouwen digitale",
      hero_title_italic: "monumenten.",
      hero_description: "Nick & Aron combineren...",
    }
  );

  // 3. De 'Live' Magie: Luister naar CloudCannon events
  useEffect(() => {
    // Deze functie wordt uitgevoerd als CloudCannon zegt: "Hé, er is nieuwe data!"
    const handleCloudCannonUpdate = (e: any) => {
      // e.detail.CloudCannon bevat de nieuwe data uit de editor
      if (e.detail && e.detail.CloudCannon) {
        setContent(e.detail.CloudCannon);
      }
    };

    // We abonneren ons op het update-event
    document.addEventListener("cloudcannon:update", handleCloudCannonUpdate);

    // Netjes opruimen als we de pagina verlaten
    return () => {
      document.removeEventListener(
        "cloudcannon:update",
        handleCloudCannonUpdate
      );
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAFA] pt-20">
      {/* ... De rest van je JSX blijft exact hetzelfde ... */}

      <div className="relative z-10 text-center max-w-5xl px-6">
        <RevealText className="inline-block" delay={0.2}>
          <span
            className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white"
            data-cms-bind="#hero_label"
          >
            {content.hero_label}
          </span>
        </RevealText>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-neutral-900 mb-8 tracking-tight cursor-default">
          <RevealText delay={0.3}>
            <span data-cms-bind="#hero_title_start">
              {content.hero_title_start}
            </span>
          </RevealText>
          <RevealText delay={0.4}>
            <span
              className="italic text-neutral-400 font-light ml-2 md:ml-4"
              data-cms-bind="#hero_title_italic"
            >
              {content.hero_title_italic}
            </span>
          </RevealText>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
          data-cms-bind="#hero_description"
        >
          {content.hero_description}
        </motion.p>

        {/* ... scroll lijntje ... */}
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
