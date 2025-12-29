import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface ProjectData {
  title: string;
  cat: string;
  year: string;
  client: string;
  role: string;
  desc: string;
  img: string;
  detailImages: string[];
}

interface ProjectDetailProps {
  project: ProjectData;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[60] bg-[#FAFAFA] overflow-y-auto overflow-x-hidden"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-50 w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer mix-blend-difference"
        data-cursor="Sluit"
      >
        <X size={24} />
      </button>

      {/* Hero Image */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={project.img.startsWith('/public') ? project.img.substring(7) : project.img}
          className="w-full h-full object-cover"
          alt={project.title}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-[1600px] mx-auto"
          >
            <span className="text-white/80 text-sm uppercase tracking-widest mb-4 block">{project.cat} — {project.year}</span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none">{project.title}</h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-32">
          <div className="md:col-span-4 space-y-8">
            <div className="border-t border-neutral-200 pt-4">
              <span className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Klant</span>
              <span className="text-lg text-neutral-900">{project.client}</span>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <span className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Rol</span>
              <span className="text-lg text-neutral-900">{project.role}</span>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <span className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Jaar</span>
              <span className="text-lg text-neutral-900">{project.year}</span>
            </div>
          </div>

          <div className="md:col-span-8">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl md:text-5xl font-serif leading-tight mb-12"
            >
              {project.desc}
            </motion.h3>
            <div className="text-neutral-500 text-lg leading-relaxed max-w-2xl space-y-6">
              <p>
                Het doel was helder: een digitale ervaring creëren die niet alleen informeert, maar ook inspireert.
                We hebben de kernwaarden van {project.client} vertaald naar een interactief systeem dat naadloos werkt op elk device.
              </p>
              <p>
                Door gebruik te maken van geavanceerde animaties en een strak gridsysteem, hebben we een tijdloos ontwerp neergezet dat klaar is voor de toekomst.
              </p>
            </div>

            <div className="mt-12">
              <Button variant="secondary">Bezoek Website</Button>
            </div>
          </div>
        </div>

        {/* Additional Images */}
        <div className="space-y-12 md:space-y-24">
          {project.detailImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <img src={src.startsWith('/public') ? src.substring(7) : src} alt={`Detail ${i}`} className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        {/* Next Project Nav */}
        <div className="mt-32 border-t border-neutral-200 pt-24 text-center">
          <span className="text-xs uppercase tracking-widest text-neutral-400 mb-4 block">Volgend Project</span>
          <div
            className="inline-flex items-center gap-4 text-4xl md:text-6xl font-serif cursor-pointer hover:italic transition-all duration-300 group"
            onClick={onClose}
            data-cursor="Volgende"
          >
            <span>Terug naar overzicht</span>
            <ArrowRight className="group-hover:translate-x-4 transition-transform duration-300" size={40} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};
