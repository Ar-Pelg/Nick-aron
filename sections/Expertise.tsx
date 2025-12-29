import React from 'react';
import { ExpertiseItem } from '../components/ExpertiseItem';
import { RevealText } from '../components/RevealText';

interface ExpertiseProps {
  data: any;
  isEditor: boolean;
}

export const Expertise: React.FC<ExpertiseProps> = ({ data, isEditor }) => {
  const safeData = data || {
    title_small: "Onze Expertise",
    title_large: "",
    items: []
  };

  return (
    <section className="bg-[#FAFAFA] pt-32 pb-12" id="expertise">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20">
        <h2
          className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8"
          data-cms-bind="#expertise.title_small"
          suppressContentEditableWarning={true}
        >
          {safeData.title_small}
        </h2>
        <RevealText disabled={isEditor}>
          <p
            className="font-serif text-4xl md:text-5xl max-w-4xl leading-tight"
            data-cms-bind="#expertise.title_large"
            suppressContentEditableWarning={true}
          >
            {safeData.title_large}
          </p>
        </RevealText>
      </div>

      <div>
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