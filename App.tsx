import React, { useState, useEffect } from 'react';
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
import contentData from './content/home.json';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [content, setContent] = useState(contentData);
  const [isEditor, setIsEditor] = useState(false);

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

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased cursor-none`}>
      <CustomCursor />
      <TracingLine />
      <Navbar />

      <main>
        <Hero data={content.hero} isEditor={isEditor} />
        <Expertise data={content.expertise} isEditor={isEditor} />
        <HorizontalGallery
          data={content.projects_section}
          projects={content.projects}
          onSelectProject={setSelectedProject}
          isEditor={isEditor}
        />
        <AboutSection data={content.about} isEditor={isEditor} />
      </main>

      <Footer data={content.footer} isEditor={isEditor} />

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
