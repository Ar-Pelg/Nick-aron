import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { ThreeCityScene } from '../three/ThreeCityScene';
import { RevealText } from '../components/RevealText';

export const AboutSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"] 
  });

  return (
    <section ref={targetRef} className="bg-neutral-900 h-[250vh] relative" id="studio">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
         {/* Background 3D Scene - Full Screen Sticky */}
         <div className="absolute inset-0 z-0">
             <ThreeCityScene scrollProgress={scrollYProgress} />
         </div>

         {/* Overlay Content - Scrolling over the scene */}
         <div className="absolute inset-0 z-10 pointer-events-none">
             <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-end pb-12">
                 {/* Content can be placed here if needed */}
             </div>
         </div>
      </div>
      
      {/* Spacer content to allow scrolling 'past' the initial view */}
      <div className="relative z-10 pointer-events-none text-white px-6 md:px-16 py-32 flex flex-col items-center justify-center min-h-screen">
           
           {/* GLASS CARD 1: Philosophy */}
           <div className="max-w-4xl mx-auto mb-24 p-12 bg-neutral-900/40 backdrop-blur-md border border-white/10 shadow-2xl">
             <RevealText><h4 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8 border-b border-white/10 pb-4 inline-block">Filosofie</h4></RevealText>
             <div className="font-serif text-4xl md:text-6xl leading-tight text-white drop-shadow-lg italic">
               "Wij geloven dat digitale perfectie ontstaat waar <span className="text-neutral-400">reductie</span> en <span className="text-neutral-400">expressie</span> elkaar ontmoeten."
             </div>
           </div>

           {/* GLASS CARD 2: Grid */}
           <div className="max-w-6xl mx-auto p-12 bg-neutral-900/60 backdrop-blur-md border border-white/10 shadow-2xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
               {[
                 { title: "Precisie", desc: "Tot op de pixel nauwkeurig. Wij accepteren geen 'bijna goed'. Elk detail telt in de digitale ervaring." },
                 { title: "Tijdloosheid", desc: "Geen trends die morgen verouderd zijn, maar klassieke principes van typografie en grid-systemen." },
                 { title: "Impact", desc: "Ontworpen met conversie en pure merkbeleving als leidraad. Wij bouwen om te raken." },
                 { title: "Transparantie", desc: "Geen jargon. Een helder proces van schets tot lancering, met open communicatie." }
               ].map((item, i) => (
                  <div key={i}>
                    <RevealText delay={0.1 * i}>
                      <h5 className="font-serif text-3xl mb-4 text-white drop-shadow-sm flex items-center gap-3">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
                        {item.title}
                      </h5>
                      <p className="text-base text-neutral-300 leading-relaxed drop-shadow-sm pl-5 font-light">{item.desc}</p>
                    </RevealText>
                  </div>
               ))}
             </div>
           </div>
      </div>
    </section>
  );
};