import React from 'react';
import { ExpertiseItem } from '../components/ExpertiseItem';
import { RevealText } from '../components/RevealText';

export const Expertise = () => {
  return (
    <section className="bg-[#FAFAFA] pt-32 pb-12" id="expertise">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20">
        <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8">Onze Expertise</h2>
        <RevealText>
          <p className="font-serif text-4xl md:text-5xl max-w-4xl leading-tight">
            Wij vertalen complexe vraagstukken naar heldere, digitale producten. 
            Van strategisch fundament tot pixel-perfecte executie.
          </p>
        </RevealText>
      </div>

      <div>
        <ExpertiseItem 
          number="1"
          title="Strategie & Identiteit"
          desc="Voordat we bouwen, moeten we begrijpen. We definiëren de kernwaarden, de doelgroep en de digitale roadmap. We creëren een visuele taal die uw merk onderscheidt in een verzadigde markt."
          tags={['Brand Audit', 'Digitale Strategie', 'Art Direction', 'Content Strategie']}
        />
        <ExpertiseItem 
          number="2"
          title="Design & Interactie"
          desc="Vorm volgt functie, maar emotie leidt de ervaring. Wij ontwerpen interfaces die intuïtief aanvoelen en visueel verbluffen, met oog voor micro-interacties die het verschil maken."
          tags={['UI/UX Design', 'Prototyping', 'Design Systems', 'Motion Design']}
        />
        <ExpertiseItem 
          number="3"
          title="Development & Tech"
          desc="De motor onder de motorkap. Wij schrijven robuuste, schaalbare code. Geen templates, maar maatwerk architectuur die razendsnel laadt en future-proof is."
          tags={['React / Next.js', 'Headless CMS', 'E-commerce', 'Creative Coding', 'Three.js']}
        />
      </div>
    </section>
  );
};