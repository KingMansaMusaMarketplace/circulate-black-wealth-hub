import React from 'react';

const items = [
  'U.S. Patent Pending 63/969,202',
  'Verified Corporation',
  'Illinois LLC',
  'GDPR-Aware Data Handling',
  'SOC 2 Roadmap 2026',
  'HBCU Partner Network',
];

const SponsorshipTrustFooter: React.FC = () => {
  return (
    <section className="relative z-10 py-10 border-t-2 border-mansagold/25 bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          {items.map((item, i) => (
            <React.Fragment key={item}>
              <span className="text-[11px] md:text-xs text-white/85 tracking-[0.15em] uppercase font-medium">
                {item}
              </span>
              {i < items.length - 1 && <span className="text-mansagold">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorshipTrustFooter;
