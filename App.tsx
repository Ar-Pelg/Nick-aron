import React from 'react';
import { CustomCursor } from './components/CustomCursor';
import { TracingLine } from './components/TracingLine';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Expertise } from './sections/Expertise';
import { HorizontalGallery } from './sections/HorizontalGallery';
import { AboutSection } from './sections/AboutSection';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white cursor-none font-sans antialiased">
      <CustomCursor />
      <TracingLine />
      <Navbar />
      
      <main>
        <Hero />
        <Expertise />
        <HorizontalGallery />
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
}