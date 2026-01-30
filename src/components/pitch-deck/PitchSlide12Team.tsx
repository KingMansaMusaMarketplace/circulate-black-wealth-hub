import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Code, 
  Briefcase, 
  Award,
  Linkedin,
  Mail
} from 'lucide-react';

const PitchSlide12Team: React.FC = () => {
  const founder = {
    name: 'Thomas D. Bowling',
    title: 'Founder & CEO',
    background: [
      'Serial entrepreneur with deep community roots',
      'Technical founder — built the entire platform',
      'Passionate about economic justice and Black wealth building',
      'Direct connection to target market and community needs'
    ],
    quote: "I built this because I lived this. Our community deserves economic infrastructure, not just another directory."
  };

  const advisors = [
    { role: 'Technical Advisor', expertise: 'Platform Architecture' },
    { role: 'Business Advisor', expertise: 'FinTech Strategy' },
    { role: 'Community Advisor', expertise: 'Black Business Networks' },
  ];

  const capabilities = [
    { icon: Code, label: 'Full-Stack Development', detail: 'React, TypeScript, Supabase' },
    { icon: Briefcase, label: 'Business Strategy', detail: 'Revenue modeling, GTM' },
    { icon: Award, label: 'Community Trust', detail: 'Deep local relationships' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-mansagold">Team</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-black/80 border-2 border-mansagold h-full">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-2 bg-mansagold/30 text-mansagold border-mansagold font-bold">
                    Founder
                  </Badge>
                  <h3 className="text-2xl font-bold text-white">{founder.name}</h3>
                  <p className="text-mansagold font-bold mb-4">{founder.title}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {founder.background.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-white font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-mansagold mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 p-4 bg-mansagold/20 rounded-xl border-l-4 border-mansagold">
                <p className="text-white font-semibold italic">"{founder.quote}"</p>
              </blockquote>

              <div className="mt-6 flex gap-3">
                <Badge variant="outline" className="border-mansagold text-mansagold font-bold">
                  <Linkedin className="w-3 h-3 mr-1" /> LinkedIn
                </Badge>
                <Badge variant="outline" className="border-mansagold text-mansagold font-bold">
                  <Mail className="w-3 h-3 mr-1" /> Contact
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Capabilities & Advisors */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Core Capabilities */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Core Capabilities</h3>
              <div className="space-y-3">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 bg-mansagold/20 rounded-lg flex items-center justify-center">
                      <cap.icon className="w-5 h-5 text-mansagold" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{cap.label}</div>
                      <div className="text-white/60 text-sm">{cap.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Advisory Network */}
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Advisory Network</h3>
              <div className="space-y-3">
                {advisors.map((advisor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold">{advisor.role}</div>
                    <Badge variant="outline" className="border-mansagold/30 text-mansagold text-xs">
                      {advisor.expertise}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-white/60 text-sm text-center">
                Expanding advisory board with 776 investment
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PitchSlide12Team;
