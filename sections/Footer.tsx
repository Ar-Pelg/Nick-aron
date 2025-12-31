import React from 'react';
import { Magnetic } from '../components/Magnetic';
import { SplineScene } from "@/components/ui/spline";
import { Spotlight } from "@/components/ui/spotlight";

interface FooterProps {
   data: any;
   isEditor: boolean;
}

export const Footer: React.FC<FooterProps> = ({ data, isEditor }) => {
   const safeData = data || {
      title_start: "Let's",
      title_italic: "talk.",
      email: "hello@nickaron.com",
      phone: "+31 (0)20 123 45 67",
      socials: [],
      copyright: "© 2024 Nick & Aron",
      location: "Amsterdam, NL"
   };

   // Simple time component
   const [time, setTime] = React.useState("");

   React.useEffect(() => {
      const updateTime = () => {
         const now = new Date();
         setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Amsterdam' }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
   }, []);

   return (
      <footer
         className="fixed bottom-0 left-0 w-full bg-[#111111] text-white -z-10 h-[80vh] flex flex-col justify-between px-6 md:px-12 py-12 overflow-hidden"
         id="contact"
      >
         {/* Spotlight Effect */}
         <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20 z-0 opacity-50 pointer-events-none"
            fill="white"
         />

         {/* Spline Bot - Layered Behind/Beside */}
         <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-100 mix-blend-screen md:mix-blend-normal">
            <div className="w-full h-full md:w-1/2 md:ml-auto relative top-20 md:top-0 scale-125 md:scale-100 origin-center md:origin-right">
               <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
               />
            </div>
         </div>

         {/* Top Section */}
         <div className="flex justify-between items-start w-full relative z-10">
            <div className="flex flex-col gap-2">
               <span className="text-neutral-500 uppercase tracking-wider text-sm">Drop us a line</span>
               <Magnetic>
                  <a href={`mailto:${safeData.email}`} className="text-2xl md:text-3xl hover:text-neutral-300 transition-colors">
                     {safeData.email}
                  </a>
               </Magnetic>
               <Magnetic>
                  <a href={`tel:${safeData.phone}`} className="text-xl md:text-2xl text-neutral-400 hover:text-white transition-colors">
                     {safeData.phone}
                  </a>
               </Magnetic>
            </div>

            <div className="hidden md:flex flex-col gap-2 text-right">
               <span className="text-neutral-500 uppercase tracking-wider text-sm">Socials</span>
               <div className="flex flex-col gap-1 items-end">
                  {safeData.socials && safeData.socials.map((social: any, i: number) => (
                     <Magnetic key={i}>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-neutral-300 transition-colors">
                           {social.label}
                        </a>
                     </Magnetic>
                  ))}
               </div>
            </div>
         </div>

         {/* Middle - Giant Text */}
         <div className="flex-grow flex items-center justify-start pointer-events-none select-none overflow-hidden relative z-10">
            <h1 className="text-[15vw] leading-[0.8] font-serif tracking-tighter text-left opacity-90 whitespace-nowrap drop-shadow-2xl">
               <span className="block">{safeData.title_start}</span>
               <span className="block italic font-light text-neutral-400">{safeData.title_italic}</span>
            </h1>
         </div>

         {/* Bottom Bar */}
         <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full border-t border-white/10 pt-8 gap-4 relative z-10">
            <div className="flex gap-8 items-center">
               <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">Version</span>
                  <span className="text-sm">2024 Edition</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">Local time</span>
                  <span className="text-sm">{time} AMS</span>
               </div>
            </div>

            <div className="flex gap-4 md:hidden">
               {/* Mobile Socials */}
               {safeData.socials && safeData.socials.map((social: any, i: number) => (
                  <a key={i} href={social.url} className="text-sm uppercase tracking-widest text-neutral-400 hover:text-white">
                     {social.label}
                  </a>
               ))}
            </div>

            <div className="flex flex-col md:items-end">
               <span className="text-xs text-neutral-500 uppercase tracking-widest">Copyright</span>
               <span className="text-sm">{safeData.copyright}</span>
            </div>
         </div>
      </footer>
   );
};