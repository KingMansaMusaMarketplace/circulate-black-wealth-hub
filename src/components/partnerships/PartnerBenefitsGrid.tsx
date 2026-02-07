import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  DollarSign, 
  Percent, 
  Award, 
  FileText, 
  BarChart3, 
  Shield,
  Sparkles,
  Users
} from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface PartnerBenefitsGridProps {
  partnerName?: string;
}

const PartnerBenefitsGrid: React.FC<PartnerBenefitsGridProps> = ({ partnerName = "Partner" }) => {
  const benefits: Benefit[] = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "$5 Per Signup Bonus",
      description: "Earn $5 for every restaurant that signs up through your referral link.",
      highlight: "One-time bonus"
    },
    {
      icon: <Percent className="w-6 h-6" />,
      title: "10% Revenue Share",
      description: "Receive 10% of all platform booking fees from referred businesses — forever.",
      highlight: "Recurring revenue"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Founding Partner Badge",
      description: "Permanent recognition as an early partner who helped build the ecosystem.",
      highlight: "Locked in forever"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Co-Branded Materials",
      description: "Automatically generated marketing kits, flyers, and email templates with your branding.",
      highlight: "Done for you"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Partner Dashboard",
      description: "Real-time analytics tracking signups, bookings, revenue, and payout history.",
      highlight: "Full transparency"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "White-Glove Migration",
      description: "Our team handles the technical migration of your listings. Zero effort required.",
      highlight: "Hands-off"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Business Tools",
      description: "Your restaurants get booking, loyalty programs, and business analytics — $700/mo value.",
      highlight: "Value to your network"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Priority Support",
      description: "Dedicated partner success manager and priority support for you and your businesses.",
      highlight: "VIP treatment"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Card className="h-full bg-slate-800/60 border-slate-700/50 hover:border-mansagold/40 transition-all duration-300 group">
            <div className="p-5 h-full flex flex-col">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-mansagold/20 flex items-center justify-center text-mansagold mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              
              {/* Title */}
              <h4 className="font-bold text-white mb-2">{benefit.title}</h4>
              
              {/* Description */}
              <p className="text-sm text-blue-200/70 flex-1">{benefit.description}</p>
              
              {/* Highlight tag */}
              {benefit.highlight && (
                <div className="mt-3">
                  <span className="text-xs bg-mansagold/10 text-mansagold px-2 py-1 rounded-full border border-mansagold/30">
                    {benefit.highlight}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PartnerBenefitsGrid;
