import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ExpertiseItemProps {
  number: string;
  title: string;
  desc: string;
  tags: string[];
}

export const ExpertiseItem: React.FC<ExpertiseItemProps> = ({ number, title, desc, tags }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="cursor-pointer group transition-colors duration-500 hover:bg-white/5"
      onClick={() => setIsOpen(!isOpen)}
      data-cursor={isOpen ? "Sluit" : "Open"}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 border-t border-white/10 py-12 grid md:grid-cols-[12rem_1fr] gap-8 items-start transition-colors duration-500">
        <span className="text-xs font-mono text-neutral-500 mt-2">0{number}</span>
        <div className="min-w-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-3xl md:text-5xl text-white group-hover:italic transition-all duration-300">{title}</h3>
            <span className={`p-2 rounded-full border border-white/20 transition-transform duration-500 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
              <ArrowUpRight size={20} className="text-white" />
            </span>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-neutral-400 text-lg font-light leading-relaxed max-w-3xl mb-8 pt-4">
                  {desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  {tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white/10 text-xs uppercase tracking-wider text-neutral-300 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && (
            <p className="text-neutral-400 font-light truncate max-w-xl group-hover:text-neutral-600 transition-colors">
              {tags.join(" — ")}
            </p>
          )}
        </div>
      </div>
    </div >
  );
};