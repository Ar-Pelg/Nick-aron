import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { CustomCursor } from './components/CustomCursor';
import { TracingLine } from './components/TracingLine';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Expertise } from './sections/Expertise';
import { HorizontalGallery } from './sections/HorizontalGallery';
import { AboutSection } from './sections/AboutSection';
import { Footer } from './sections/Footer';
import { ProjectDetail, ProjectData } from './components/ProjectDetail';
import { Preloader } from './components/Preloader';
import contentData from './content/home.json';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [content, setContent] = useState(contentData);
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // 1. Check Initial Editor State (including parent for iframes)
    const checkEditor = () => {
      try {
        const inCloudCannon =
          (typeof window !== "undefined" && (window as any).CloudCannon) ||
          (typeof window !== "undefined" && window.parent && (window.parent as any).CloudCannon);

        if (inCloudCannon) {
          // console.log("✅ CloudCannon detected");
          setIsEditor(true);
          // Don't show preloader in editor
          setIsLoading(false);
          // Stop polling once found
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        // Silently fail if access to window.parent is blocked
        console.warn("CloudCannon check failed:", error);
      }
    };

    // 2. Live Update Listener
    const handleUpdate = (e: any) => {
      if (e.detail && e.detail.CloudCannon) {
        setContent({ ...e.detail.CloudCannon });
        setIsEditor(true);
        setIsLoading(false);
        if (intervalId) clearInterval(intervalId);
      }
    };

    // Use document for load event as per docs
    document.addEventListener("cloudcannon:load", checkEditor);
    document.addEventListener("cloudcannon:update", handleUpdate);

    // IMMEDIATE CHECK
    checkEditor();

    // POLLING CHECK (Backup for race conditions)
    // Run for max 10 seconds then stop to save resources if not in editor
    let attempts = 0;
    intervalId = setInterval(() => {
      attempts++;
      checkEditor();
      if (attempts > 10) clearInterval(intervalId);
    }, 1000);

    return () => {
      document.removeEventListener("cloudcannon:update", handleUpdate);
      document.removeEventListener("cloudcannon:load", checkEditor);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className={`min-h-screen text-white selection:bg-white selection:text-neutral-900 font-sans antialiased`}>
      <AnimatePresence>
        {isLoading && !isEditor && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <CustomCursor />

      {/* Main Content Wrapper - Slides over the Footer */}
      <div className="relative z-10 bg-[#161617] mb-[80vh] shadow-2xl rounded-b-3xl">
        <Navbar onOpenLab={() => { }} />

        <main>
          <Hero
            data={content.hero}
            projects={content.projects}
            onSelectProject={setSelectedProject}
            isEditor={isEditor}
          />
          <Expertise data={content.expertise} isEditor={isEditor} />
          <HorizontalGallery
            data={content.projects_section}
            projects={content.projects}
            onSelectProject={setSelectedProject}
            isEditor={isEditor}
          />
          <AboutSection data={content.about} isEditor={isEditor} />
        </main>
      </div>

      <Footer data={content.footer} isEditor={isEditor} />

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            key={selectedProject.title}
            project={selectedProject}
            nextProject={(() => {
              const currentIndex = content.projects.findIndex((p: any) => p.title === selectedProject.title);
              const nextIndex = (currentIndex + 1) % content.projects.length;
              return content.projects[nextIndex];
            })()}
            onNext={(next) => setSelectedProject(next)}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
