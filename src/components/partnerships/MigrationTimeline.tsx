import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileSignature, 
  Database, 
  Mail, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface TimelineStep {
  week: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface MigrationTimelineProps {
  partnerName?: string;
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  {
    week: "Week 1",
    title: "Partnership Agreement",
    description: "Sign partnership agreement and establish revenue share terms. Receive dedicated partner success manager.",
    icon: <FileSignature className="w-6 h-6" />
  },
  {
    week: "Week 2-3",
    title: "API Integration",
    description: "Automated import of existing business listings using our migration tools. Zero effort required from your team.",
    icon: <Database className="w-6 h-6" />
  },
  {
    week: "Week 4-6",
    title: "Business Outreach",
    description: "Co-branded email campaigns to restaurant owners announcing enhanced booking capabilities and Founding Member benefits.",
    icon: <Mail className="w-6 h-6" />
  },
  {
    week: "Week 7-8",
    title: "Launch & Analytics",
    description: "Full integration with real-time partner dashboard tracking signups, bookings, and revenue share earnings.",
    icon: <Rocket className="w-6 h-6" />
  }
];

const MigrationTimeline: React.FC<MigrationTimelineProps> = ({
  partnerName = "Partner",
  steps = defaultSteps
}) => {
  return (
    <Card className="bg-black/80 border-2 border-mansagold/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-2xl">
          <div className="w-10 h-10 rounded-full bg-mansagold/20 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-mansagold" />
          </div>
          Migration Path to Partnership
        </CardTitle>
        <p className="text-blue-200/70">
          A simple 8-week journey from agreement to fully integrated partnership
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Timeline connector line */}
        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-mansagold via-mansagold/50 to-mansagold/20 hidden md:block" />
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              className="relative flex gap-4 md:gap-6"
            >
              {/* Step indicator */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-mansagold/20 to-mansagold/5 border border-mansagold/40 flex flex-col items-center justify-center">
                  <div className="text-mansagold">{step.icon}</div>
                  <span className="text-xs text-mansagold/80 font-medium mt-1">{step.week}</span>
                </div>
              </div>
              
              {/* Step content */}
              <div className="flex-1 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-mansagold/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-lg">{step.title}</h4>
                  {index < steps.length - 1 ? (
                    <span className="text-xs text-blue-300/60 bg-slate-700/50 px-2 py-1 rounded">
                      In Progress
                    </span>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-blue-200/70 mt-2 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-mansagold font-medium">
            🚀 Most partners see their first bookings within 30 days of signing
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MigrationTimeline;
