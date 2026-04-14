import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PitchSlide8Competitive: React.FC = () => {
  const capabilities = [
    'AI Directory',
    'Agentic AI',
    'B2B Match',
    'Loyalty',
    'CMAL',
    'Fraud Det.',
    'Patent IP',
    'Score',
  ];

  const competitors = [
    { name: '1325.AI', scores: [true, true, true, true, true, true, true, '8/8'], highlight: true, price: '$19–420+/mo' },
    { name: 'Amazon', scores: [false, true, true, false, false, true, true, '3.5/8'], highlight: false, price: 'Variable' },
    { name: 'Alibaba', scores: [false, false, true, false, false, true, true, '3/8'], highlight: false, price: 'Variable' },
    { name: 'Salesforce', scores: [false, true, false, false, false, false, true, '2.5/8'], highlight: false, price: '$125+/user' },
    { name: 'Yelp', scores: [true, false, false, false, false, false, false, '1.5/8'], highlight: false, price: '$0–300/mo' },
    { name: 'WeBuyBlack', scores: [true, false, false, false, false, false, false, '1.5/8'], highlight: false, price: 'Free' },
    { name: 'OBWS', scores: [true, false, false, false, false, false, false, '1/8'], highlight: false, price: 'Free' },
  ];

  const moats = [
    { label: 'IP Protection', rating: 'Very High' },
    { label: 'Data Network Effects', rating: 'Very High' },
    { label: 'Switching Costs', rating: 'High' },
    { label: 'Mission Alignment', rating: 'High' },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <span className="mx-auto inline-flex h-5 w-5 items-center justify-center rounded-full border border-mansagold/50 bg-mansagold/10 text-[11px] font-bold leading-none text-mansagold">
          ✓
        </span>
      );
    }

    if (typeof value === 'string') {
      return <span className="text-mansagold font-bold text-xs">{value}</span>;
    }

    return (
      <span className="mx-auto inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] font-bold leading-none text-white/40">
        ✕
      </span>
    );
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-mansagold/80 mb-2">Independent Market Intelligence — 30+ Platforms Analyzed</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Competitive <span className="text-mansagold">Landscape</span>
          </h2>
          <p className="text-base text-white/60 max-w-3xl mx-auto">
            "No platform scores above 3.5/8 against 1325.AI's full stack"
          </p>
        </div>

        <div>
          <Card className="overflow-hidden bg-black/80 border border-mansagold/30">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-white font-bold text-xs">Platform</th>
                    {capabilities.map((cap, i) => (
                      <th key={i} className="text-center p-2 text-white/60 font-bold text-[10px] uppercase tracking-wide">
                        {cap}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp, i) => (
                    <tr
                      key={i}
                      className={`border-b border-white/5 ${comp.highlight ? 'bg-mansagold/10' : ''}`}
                    >
                      <td className={`p-2.5 font-medium text-xs ${comp.highlight ? 'text-mansagold font-bold' : 'text-white'}`}>
                        <div>{comp.name}</div>
                        <div className="text-[10px] text-white/40">{comp.price}</div>
                      </td>
                      {comp.scores.map((score, j) => (
                        <td key={j} className={`p-2 text-center ${comp.highlight && j < 7 ? 'border-x border-mansagold/10' : ''}`}>
                          {renderCell(score)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Moat Framework */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {moats.map((moat, i) => (
            <Card key={i} className="p-3 bg-black/60 border border-mansagold/30 text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{moat.label}</p>
              <p className="text-sm text-mansagold font-bold flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                {moat.rating}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-3 bg-black/60 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Full Stack</p>
            <p className="text-sm text-white font-semibold">
              8/8 Capabilities — Only platform with complete coverage
            </p>
          </Card>
          <Card className="p-3 bg-black/60 border border-mansagold/30">
            <p className="text-xs text-mansagold/70 uppercase tracking-wider mb-1">Replication Barrier</p>
            <p className="text-sm text-white font-semibold">
              $15–20M and 3–4 years to replicate
            </p>
          </Card>
          <Card className="p-3 bg-black/60 border border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Market Position</p>
            <p className="text-sm text-white font-semibold">
              0 direct competitors across 30+ platforms analyzed
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PitchSlide8Competitive;
