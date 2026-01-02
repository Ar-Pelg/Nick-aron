import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/Button';
import { ProjectData } from '../components/ProjectDetail';
import { useScrollVelocity } from '../hooks/useScrollVelocity';

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
      // Desktop: Intro (~40vw) + Projects (50vw each) + Gaps
      // Mobile: Intro (~80vw) + Projects (80vw each) + Gaps
      const introWidth = isMobile ? 85 : 45;
      const projectWidth = isMobile ? 85 : 55;

      const totalWidthVW = introWidth + (numProjects * projectWidth);
      const viewportWidthVW = 100;

      // We need to move enough to see the end, so total width minus viewport
      const neededScrollVW = totalWidthVW - viewportWidthVW;

      // Add a little buffer (5vw) to ensure last item clears nicely
      const finalScroll = Math.max(0, neededScrollVW);

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

  // Velocity Skew
  const smoothVelocity = useScrollVelocity();
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-15, 15]);

  const safeData = data || {
    title_small: "Geselecteerd Werk",
    title_large_start: "Esthetiek ontmoet",
    title_large_italic: "Functionaliteit.",
    description: "",
    scroll_text: "Scroll om te ontdekken"
  };

  // Parallax Effect
  // Reduced range to ensure image stays within frame (Scale 1.25 provides 12.5% buffer, we move 10%)
  const parallaxX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#161617] text-white" id="projecten">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 z-20">
          <h2
            className="text-xs uppercase tracking-[0.2em] text-neutral-400"
          >
            {safeData.title_small}
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-12 pl-6 md:pl-12 will-change-transform">
          <div className="flex-shrink-0 w-[80vw] md:w-[40vw] flex flex-col justify-center pr-20">
            <h3 className="font-serif text-5xl md:text-7xl mb-8 leading-none perspective-500">
              <motion.div style={{ skewX }}>
                <span>{safeData.title_large_start}</span> <br />
                <span className="italic text-neutral-500">{safeData.title_large_italic}</span>
              </motion.div>
            </h3>
            <p
              className="text-neutral-400 font-light text-lg max-w-md mb-8"
            >
              {safeData.description}
            </p>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
              <div className="w-12 h-[1px] bg-white" />
              <span>{safeData.scroll_text}</span>
            </div>
          </div>

          {projects && projects.map((project, i) => (
            <div
              key={i}
              className="relative group flex-shrink-0 w-[80vw] md:w-[50vw] h-[70vh] overflow-hidden bg-neutral-800 cursor-pointer"
              data-cursor="Bekijk Case"
              onClick={() => onSelectProject(project)}
            >
              <motion.img
                src={project.img.startsWith('/public') ? project.img.substring(7) : project.img}
                alt={project.title}
                loading="lazy"
                decoding="async"
                style={{ x: parallaxX, scale: 1.25 }}
                whileHover={{ scale: 1.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100"
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
