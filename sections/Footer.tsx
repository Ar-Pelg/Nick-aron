import React from 'react';
import { Button } from '../components/Button';
import { AnimatedPigeon } from '../components/AnimatedPigeon';
import { RevealText } from '../components/RevealText';

interface FooterProps {
   data: any;
   isEditor: boolean;
}

export const Footer: React.FC<FooterProps> = ({ data, isEditor }) => {
   const safeData = data || {
      title_start: "Let's",
      title_italic: "talk.",
      button_text: "Plan Kennismaking",
      email: "hello@nickaron.com",
      phone: "+31 (0)20 123 45 67",
      socials: [],
      copyright: "",
      location: ""
   };

   return (
      <footer className="bg-neutral-900 text-white py-32 overflow-hidden relative" id="contact">
         {/* Fake noise/texture overlay if external texture not available, using CSS radial gradient fallback */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

         <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 mb-32 relative">
               <AnimatedPigeon />

               <div>
                  <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.8] relative z-10">
                     <RevealText><span data-cms-bind="#footer.title_start" suppressContentEditableWarning={true}>{safeData.title_start}</span></RevealText>
                     <RevealText delay={0.1}>
                        <span
                           className="italic text-neutral-500"
                           data-cms-bind="#footer.title_italic"
                           suppressContentEditableWarning={true}
                        >
                           {safeData.title_italic}
                        </span>
                     </RevealText>
                  </h2>
                  <Button variant="white" className="border-white text-white">
                     <span data-cms-bind="#footer.button_text" suppressContentEditableWarning={true}>{safeData.button_text}</span>
                  </Button>
               </div>
               <div className="flex flex-col justify-end lg:items-end">
                  <ul className="space-y-4 text-lg font-light text-neutral-300 lg:text-right mb-12">
                     <li><a href={`mailto:${safeData.email}`} className="hover:text-white transition-colors cursor-pointer" data-cursor="Email" data-cms-bind="#footer.email" suppressContentEditableWarning={true}>{safeData.email}</a></li>
                     <li><a href={`tel:${safeData.phone}`} className="hover:text-white transition-colors cursor-pointer" data-cursor="Bel" data-cms-bind="#footer.phone" suppressContentEditableWarning={true}>{safeData.phone}</a></li>
                  </ul>
                  <div className="flex gap-8 text-xs uppercase tracking-widest text-neutral-500">
                     {safeData.socials && safeData.socials.map((social: any, i: number) => (
                        <a key={i} href={social.url} className="hover:text-white transition-colors cursor-pointer">{social.label}</a>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-800 pt-8 gap-4">
               <span className="text-neutral-600 text-xs uppercase tracking-widest" data-cms-bind="#footer.copyright" suppressContentEditableWarning={true}>{safeData.copyright}</span>
               <span className="text-neutral-600 text-xs uppercase tracking-widest" data-cms-bind="#footer.location" suppressContentEditableWarning={true}>{safeData.location}</span>
            </div>
         </div>
      </footer>
   );
};