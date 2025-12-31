import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Magnetic } from './Magnetic';

interface NavbarProps {
  onOpenLab?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLab }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md border-b border-neutral-100' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <Magnetic>
          <a href="#" className="font-serif text-2xl tracking-tight text-neutral-900 z-50 mix-blend-difference cursor-pointer" data-cursor="Home">
            N<span className="italic text-neutral-400">&</span>A
          </a>
        </Magnetic>
        <div className="hidden md:flex items-center gap-12">
          {['Expertise', 'Projecten', 'Studio'].map((item) => (
            <Magnetic key={item}>
              <a href={`#${item.toLowerCase()}`} className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300 cursor-pointer p-2">
                {item}
              </a>
            </Magnetic>
          ))}

          {/* 
            <Magnetic>
            <button 
              onClick={onOpenLab} 
              className="group flex items-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-amber-600 transition-colors">Lab</span>
            </button>
            </Magnetic> 
          */}

          <Magnetic>
            <a href="#contact" className="block">
              <Button variant="primary" className="px-6 py-2 text-xs" data-cursor="Start">Start Project</Button>
            </a>
          </Magnetic>
        </div>
      </div>
    </nav>
  );
};