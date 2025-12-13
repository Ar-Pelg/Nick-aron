import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealText } from "../components/RevealText";
import contentData from "../content/home.json";

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Initialiseer state
  const [content, setContent] = useState(contentData);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // 1. Check of we in de editor zitten
    const checkEditor = () => {
      const inCloudCannon =
        typeof window !== "undefined" && (window as any).CloudCannon;
      if (inCloudCannon) {
        setIsEditor(true);
      }
    };

    // 2. LIVE UPDATE FUNCTIE
    const handleUpdate = (e: any) => {
      // Check in je console (F12) of je dit vuurtje ziet!
      console.log("🔥 Update ontvangen:", e.detail?.CloudCannon);

      if (e.detail && e.detail.CloudCannon) {
        // TRUCJE: De ... (spread operator) forceert React om te re-renderen
        setContent({ ...e.detail.CloudCannon });
        setIsEditor(true);
      }
    };

    // We gebruiken 'window' voor betere betrouwbaarheid
    window.addEventListener("cloudcannon:update", handleUpdate);
    window.addEventListener("cloudcannon:load", checkEditor);

    // Voer check uit
    checkEditor();
    setTimeout(checkEditor, 500);

    return () => {
      window.removeEventListener("cloudcannon:update", handleUpdate);
      window.removeEventListener("cloudcannon:load", checkEditor);
    };
  }, []);

  // Veilige fallback (voorkomt crashes bij lege data)
  const safeContent = content || {
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
        {isEditor ? (
          <span
            suppressContentEditableWarning={true} // Voorkomt browser warnings
            className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white cursor-text"
            data-cms-bind="#hero_label"
          >
            {safeContent.hero_label}
          </span>
        ) : (
          <RevealText className="inline-block" delay={0.2}>
            <span className="inline-block py-1 px-3 border border-neutral-200 rounded-full text-[10px] uppercase tracking-widest mb-6 bg-white">
              {safeContent.hero_label}
            </span>
          </RevealText>
        )}

        {/* --- TITEL --- */}
        <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-neutral-900 mb-8 tracking-tight cursor-default">
          {isEditor ? (
            <>
              <span
                suppressContentEditableWarning={true}
                data-cms-bind="#hero_title_start"
              >
                {safeContent.hero_title_start}
              </span>
              <span
                suppressContentEditableWarning={true}
                className="italic text-neutral-400 font-light ml-2 md:ml-4"
                data-cms-bind="#hero_title_italic"
              >
                {safeContent.hero_title_italic}
              </span>
            </>
          ) : (
            <>
              <RevealText delay={0.3}>
                <span>{safeContent.hero_title_start}</span>
              </RevealText>
              <RevealText delay={0.4}>
                <span className="italic text-neutral-400 font-light ml-2 md:ml-4">
                  {safeContent.hero_title_italic}
                </span>
              </RevealText>
            </>
          )}
        </h1>

        {/* --- OMSCHRIJVING --- */}
        {isEditor ? (
          <p
            suppressContentEditableWarning={true}
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
            data-cms-bind="#hero_description"
          >
            {safeContent.hero_description}
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-neutral-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {safeContent.hero_description}
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
