import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/Button';
import { ProjectData } from '../components/ProjectDetail';

interface HorizontalGalleryProps {
  projects: ProjectData[];
  onSelectProject: (project: ProjectData) => void;
}

export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ projects, onSelectProject }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"] 
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 text-white" id="projecten">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 z-20">
           <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-400">Geselecteerd Werk</h2>
        </div>

        <motion.div style={{ x }} className="flex gap-12 pl-6 md:pl-12 will-change-transform">
           <div className="flex-shrink-0 w-[80vw] md:w-[40vw] flex flex-col justify-center pr-20">
              <h3 className="font-serif text-5xl md:text-7xl mb-8 leading-none">
                Esthetiek ontmoet <br /> <span className="italic text-neutral-500">Functionaliteit.</span>
              </h3>
              <p className="text-neutral-400 font-light text-lg max-w-md mb-8">
                Een overzicht van onze meest recente digitale projecten, waarbij elke pixel zorgvuldig is geplaatst.
              </p>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
                <div className="w-12 h-[1px] bg-white" /> Scroll om te ontdekken
              </div>
           </div>

           {projects.map((project, i) => (
             <div 
               key={i} 
               className="relative group flex-shrink-0 w-[80vw] md:w-[50vw] h-[70vh] overflow-hidden bg-neutral-800 cursor-pointer"
               data-cursor="Bekijk Case"
               onClick={() => onSelectProject(project)}
             >
               <img 
                src={project.img} 
                alt={project.title} 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
               <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">{project.cat}</span>
                  <h4 className="font-serif text-4xl md:text-6xl text-white mb-6">{project.title}</h4>
                  <Button variant="white" className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Bekijk Case</Button>
               </div>
             </div>
           ))}
        </motion.div>
      </div>
    </section>
  );
};
