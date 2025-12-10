import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md border-b border-neutral-100' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl tracking-tight text-neutral-900 z-50 mix-blend-difference cursor-pointer" data-cursor="Home">
          N<span className="italic text-neutral-400">&</span>A
        </a>
        <div className="hidden md:flex items-center gap-12">
          {['Expertise', 'Projecten', 'Studio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors duration-300 cursor-pointer">
              {item}
            </a>
          ))}
          <Button variant="primary" className="px-6 py-2 text-xs" data-cursor="Start">Start Project</Button>
        </div>
      </div>
    </nav>
  );
};