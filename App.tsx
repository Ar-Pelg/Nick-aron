import React, { useState } from 'react';
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

// Project Data source
const PROJECTS: ProjectData[] = [
    {
      title: "Rijksmuseum",
      cat: "Digital Archive",
      year: "2024",
      client: "Rijksmuseum Amsterdam",
      role: "UX/UI Design & Development",
      img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1200&auto=format&fit=crop",
      desc: "Een heruitvinding van het digitale archief. We hebben 100.000 kunstwerken toegankelijk gemaakt via een revolutionaire visuele zoekmachine.",
      detailImages: [
        "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1600&auto=format&fit=crop"
      ]
    },
    {
      title: "Vogue Living",
      cat: "E-Commerce",
      year: "2023",
      client: "Condé Nast",
      role: "E-Commerce Strategy",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
      desc: "Een immersive shopping experience waar content en commerce samensmelten. Redactionele verhalen die direct leiden naar aankoop.",
      detailImages: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1600&auto=format&fit=crop"
      ]
    },
    {
      title: "Aesop Skin",
      cat: "Brand Experience",
      year: "2023",
      client: "Aesop",
      role: "Creative Direction",
      img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
      desc: "De digitale vertaling van de zintuiglijke winkelervaring. Een minimalistische, rustgevende interface die de focus legt op rituelen.",
      detailImages: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=1600&auto=format&fit=crop"
      ]
    },
    {
      title: "Polestar",
      cat: "Configurator",
      year: "2024",
      client: "Polestar Automotive",
      role: "3D Development",
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      desc: "Een real-time 3D configurator die prestaties en esthetiek combineert. Gebruikers bouwen hun droomauto in een fotorealistische omgeving.",
      detailImages: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1600&auto=format&fit=crop"
      ]
    }
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white cursor-none font-sans antialiased">
      <CustomCursor />
      <TracingLine />
      <Navbar />
      
      <main>
        <Hero />
        <Expertise />
        <HorizontalGallery 
          projects={PROJECTS} 
          onSelectProject={setSelectedProject} 
        />
        <AboutSection />
      </main>
      
      <Footer />

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
