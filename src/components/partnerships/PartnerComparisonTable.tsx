import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, X, Minus, ArrowRight } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  before: boolean | 'partial' | 'N/A';
  after: boolean | 'partial';
  highlight?: boolean;
}

interface PartnerComparisonTableProps {
  partnerName: string;
  features: ComparisonFeature[];
}

const PartnerComparisonTable: React.FC<PartnerComparisonTableProps> = ({
  partnerName,
  features
}) => {
  const renderCell = (value: boolean | 'partial' | 'N/A') => {
    if (value === true) {
      return <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />;
    }
    if (value === 'partial') {
      return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />;
    }
    if (value === 'N/A') {
      return <span className="text-slate-500 text-sm">N/A</span>;
    }
    return <X className="w-5 h-5 text-red-400/50 mx-auto" />;
  };

  return (
    <Card className="overflow-hidden bg-black/80 border-2 border-mansagold/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white font-bold text-lg">Feature</th>
              <th className="text-center p-4 font-bold text-white/70 min-w-[150px]">
                <div className="flex flex-col items-center">
                  <span>{partnerName}</span>
                  <span className="text-xs font-normal text-blue-300/60">Today</span>
                </div>
              </th>
              <th className="text-center p-4 bg-mansagold/20 min-w-[180px]">
                <div className="flex flex-col items-center">
                  <span className="text-mansagold font-bold">{partnerName} + 1325.AI</span>
                  <span className="text-xs font-normal text-mansagold/70">Partnership</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <motion.tr 
                key={i} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <td className={`p-4 text-white font-medium ${feature.highlight ? 'bg-mansagold/5' : ''}`}>
                  {feature.highlight && (
                    <ArrowRight className="w-4 h-4 text-mansagold inline mr-2" />
                  )}
                  {feature.name}
                </td>
                <td className="p-4 text-center">{renderCell(feature.before)}</td>
                <td className="p-4 text-center bg-mansagold/10">{renderCell(feature.after)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="p-4 bg-slate-900/60 border-t border-white/10 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-blue-200/70">Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-blue-200/70">Partial/Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-red-400/50" />
          <span className="text-sm text-blue-200/70">Not Available</span>
        </div>
      </div>
    </Card>
  );
};

export default PartnerComparisonTable;
