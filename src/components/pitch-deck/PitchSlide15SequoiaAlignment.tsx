import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Database, 
  Bot, 
  Building2, 
  Heart, 
  Zap,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const PitchSlide15SequoiaAlignment: React.FC = () => {
  const alignmentPoints = [
    {
      sequoiaInsight: '"A data flywheel tied to a metric is one of the best moats you can build."',
      ourAlignment: 'CMAL 2.3x Multiplier & Economic Karma',
      description: 'Our flywheel is tied to quantifiable wealth circulation metrics that improve with every transaction.',
      icon: Database,
      color: 'mansagold'
    },
    {
      sequoiaInsight: '"The Agent Economy... agents that can transfer resources, make transactions, understand trust."',
      ourAlignment: 'Kayla AI + Susu Escrow + B2B Matching',
      description: 'Already building toward the agent economy with voice AI, automated financial transactions, and trust-based matching.',
      icon: Bot,
      color: 'mansablue'
    },
    {
      sequoiaInsight: '"Go vertical-specific, function-specific. Build moats across the entire value chain."',
      ourAlignment: 'Only PaaS for Black-Owned Commerce',
      description: '27 patents covering consumer → business → B2B → developer APIs. Full value chain ownership.',
      icon: Building2,
      color: 'green-500'
    },
    {
      sequoiaInsight: '"Customer trust is more important than your product at this point in time."',
      ourAlignment: 'Founder\'s Community Roots + Founding Member Status',
      description: 'Thomas D. Bowling\'s authentic connection plus scarcity-driven trust model builds unassailable community moat.',
      icon: Heart,
      color: 'red-500'
    },
    {
      sequoiaInsight: '"Go at maximum velocity. All of the time. Nature hates a vacuum."',
      ourAlignment: 'Sept 2026 Deadline + 100K Business Target',
      description: 'Built-in urgency with Founding Member cutoff driving accelerated adoption and viral growth.',
      icon: Zap,
      color: 'yellow-500'
    },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">
            <Target className="w-3 h-3 mr-1" />
            Sequoia AI Ascent 2025
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Aligned with the <span className="text-mansagold">Trillion-Dollar Thesis</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Our platform directly validates Sequoia Capital's framework for the next wave of AI infrastructure winners
          </p>
        </motion.div>

        <div className="space-y-4">
          {alignmentPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-black/80 border-2 border-mansagold/50 hover:border-mansagold transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${point.color}/30`}>
                    <point.icon className={`w-6 h-6 text-${point.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <p className="text-white/80 text-sm italic font-medium flex-1">
                        {point.sequoiaInsight}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <h4 className="text-white font-bold">{point.ourAlignment}</h4>
                    </div>
                    <p className="text-white/70 text-sm font-medium">{point.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Card className="inline-flex items-center gap-3 px-6 py-3 bg-black/80 border-2 border-mansagold">
            <span className="text-white font-bold">Source:</span>
            <a 
              href="https://youtu.be/v9JBMnxuPX8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-mansagold hover:text-mansagold-light flex items-center gap-1 font-semibold"
            >
              Sequoia AI Ascent 2025 Keynote
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-white font-medium text-sm">| May 2025 | 450K+ views</span>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide15SequoiaAlignment;
