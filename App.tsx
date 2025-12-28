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
    // 1. Check Initial Editor State
    const checkEditor = () => {
      const inCloudCannon = typeof window !== "undefined" && (window as any).CloudCannon;
      if (inCloudCannon) setIsEditor(true);
    };

    // 2. Live Update Listener
    const handleUpdate = (e: any) => {
      if (e.detail && e.detail.CloudCannon) {
        console.log("🔥 CloudCannon Update:", e.detail.CloudCannon);
        setContent({ ...e.detail.CloudCannon });
        setIsEditor(true);
      }
    };

    window.addEventListener("cloudcannon:update", handleUpdate);
    window.addEventListener("cloudcannon:load", checkEditor);

    checkEditor();

    return () => {
      window.removeEventListener("cloudcannon:update", handleUpdate);
      window.removeEventListener("cloudcannon:load", checkEditor);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased ${!isEditor ? 'cursor-none' : ''}`}>
      {!isEditor && <CustomCursor />}
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
