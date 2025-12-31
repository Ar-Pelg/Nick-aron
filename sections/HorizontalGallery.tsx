import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/Button';
import { ProjectData } from '../components/ProjectDetail';

interface HorizontalGalleryProps {
  projects: ProjectData[];
  data: any;
  isEditor: boolean;
  onSelectProject: (project: ProjectData) => void;
}

export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ projects, data, onSelectProject }) => {
  const targetRef = useRef(null);
  const [scrollRange, setScrollRange] = React.useState("-60%");

  // Dynamic scroll calculation
  React.useEffect(() => {
    const calculateScroll = () => {
      const isMobile = window.innerWidth < 768;
      const numProjects = projects ? projects.length : 0;

      // Estimated widths in VW
      // Desktop: Intro (~30vw) + Projects (45vw each) + Gaps (10vw each)
      const introWidth = isMobile ? 90 : 35;
      const projectWidth = isMobile ? 85 : 45;
      const gapWidth = isMobile ? 10 : 15; // Increased gap

      const totalWidthVW = introWidth + (numProjects * (projectWidth + gapWidth));
      const viewportWidthVW = 100;

      // We need to move enough to see the end, so total width minus viewport
      const neededScrollVW = totalWidthVW - viewportWidthVW;

      // Add a little buffer
      const finalScroll = Math.max(0, neededScrollVW + 5);

      setScrollRange(`-${finalScroll}vw`);
    };

    calculateScroll();
    window.addEventListener('resize', calculateScroll);
    return () => window.removeEventListener('resize', calculateScroll);
  }, [projects]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", scrollRange]);

  const safeData = data || {
    title_small: "Geselecteerd Werk",
    title_large_start: "Esthetiek",
    title_large_italic: "& Functie",
    description: "Een curatie van digitale ervaringen.",
    scroll_text: "Scroll om te ontdekken"
  };

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 text-white" id="projecten">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        {/* Intro Section - Static visual anchor */}
        <div className="absolute top-12 left-6 md:left-12 z-20 pointer-events-none">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {safeData.title_small}
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-12 md:gap-40 pl-6 md:pl-12 will-change-transform items-center h-full">

          {/* Intro Card */}
          <div className="flex-shrink-0 w-[80vw] md:w-[30vw] flex flex-col justify-center pr-12">
            <h3 className="font-serif text-6xl md:text-8xl mb-8 leading-[0.9]">
              <span className="opacity-40">{safeData.title_large_start}</span> <br />
              <span className="italic text-white">{safeData.title_large_italic}</span>
            </h3>
            <p className="text-neutral-500 font-light text-lg mb-12 max-w-xs leading-relaxed">
              {safeData.description}
            </p>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-600">
              <div className="w-8 h-[1px] bg-neutral-700" />
              <span>{safeData.scroll_text}</span>
            </div>
          </div>

          {/* Project Cards - Museum Style */}
          {projects && projects.map((project, i) => (
            <div
              key={i}
              className="relative group flex-shrink-0 w-[85vw] md:w-[45vw] flex flex-col gap-6 cursor-none"
              onClick={() => onSelectProject(project)}
            >
              {/* Image Frame */}
              <div
                className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-neutral-800"
                data-cursor="Bekijk"
              >
                <img
                  src={project.img.startsWith('/public') ? project.img.substring(7) : project.img}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale-[0.2] group-hover:grayscale-0"
                />
              </div>

              {/* Caption */}
              <div className="flex justify-between items-start border-t border-neutral-800 pt-6 transition-colors duration-500 group-hover:border-neutral-600">
                <div>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">{project.cat}</span>
                  <h4 className="font-serif text-3xl md:text-4xl text-neutral-300 group-hover:text-white transition-colors duration-300">
                    {project.title}
                  </h4>
                </div>
                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Button variant="white" className="text-xs px-6 py-2">Bekijk Case</Button>
                </div>
              </div>
            </div>
          ))}

          {/* Spacer at end */}
          <div className="w-[10vw] flex-shrink-0" />

        </motion.div>
      </div>
    </section>
  );
};
