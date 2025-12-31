import React, { useRef } from 'react';
import { ExpertiseItem } from '../components/ExpertiseItem';
import { RevealText } from '../components/RevealText';
import { TracingLine } from '../components/TracingLine';

interface ExpertiseProps {
  data: any;
  isEditor: boolean;
}

export const Expertise: React.FC<ExpertiseProps> = ({ data, isEditor }) => {
  const itemsRef = useRef<HTMLDivElement>(null);

  const safeData = data || {
    title_small: "Onze Expertise",
    title_large: "",
    items: []
  };

  return (
    <section className="bg-[#FAFAFA] pt-32 pb-12 relative overflow-hidden" id="expertise">

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20 relative z-10">
        <h2
          className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8"
        >
          {safeData.title_small}
        </h2>
        <RevealText disabled={isEditor}>
          <p
            className="font-serif text-4xl md:text-5xl max-w-4xl leading-tight pb-2"
          >
            {safeData.title_large}
          </p>
        </RevealText>
      </div>

      <div ref={itemsRef} className="relative z-10">
        <TracingLine
          containerRef={itemsRef}
          className="absolute left-0 right-0 bottom-0 top-24 pointer-events-none hidden md:block z-0"
        />
        {safeData.items && safeData.items.map((item: any, i: number) => (
          <ExpertiseItem
            key={i}
            number={item.number}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
          />
        ))}
      </div>
    </section>
  );
};