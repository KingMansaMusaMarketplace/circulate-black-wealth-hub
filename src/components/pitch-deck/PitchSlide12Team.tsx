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
  Mail,
  Bot,
  TrendingUp,
  Shield,
  BarChart3
} from 'lucide-react';

const PitchSlide12Team: React.FC = () => {
  const founder = {
    name: 'Thomas D. Bowling',
    title: 'Founder & CEO',
    background: [
      'Serial entrepreneur with deep community roots',
      'Technical founder — built the entire platform',
      'Passionate about economic justice and community wealth building',
      'Direct connection to target market and community needs'
    ],
    quote: "I built this because I lived this. Our community deserves economic infrastructure, not just another directory."
  };

  const advisors = [
    { role: 'Technical Advisor', expertise: 'Platform Architecture' },
    { role: 'Business Advisor', expertise: 'FinTech Strategy' },
    { role: 'Community Advisor', expertise: 'Community Business Networks' },
  ];

  const capabilities = [
    { icon: Code, label: 'Full-Stack Development', detail: 'React, TypeScript, Supabase' },
    { icon: Briefcase, label: 'Business Strategy', detail: 'Revenue modeling, GTM' },
    { icon: Award, label: 'Community Trust', detail: 'Deep local relationships' },
  ];

  const aiWorkforce = [
    { 
      icon: TrendingUp, 
      name: 'Kayla CRO', 
      role: 'AI Chief Revenue Officer',
      detail: 'ARR forecasting across 8 revenue streams, pricing optimization, MRR/churn/NRR tracking'
    },
    { 
      icon: Shield, 
      name: 'Kayla IP Shield', 
      role: 'AI Patent & IP Strategist',
      detail: '27 patent claims monitoring, competitive filing surveillance, claim amendments'
    },
    { 
      icon: BarChart3, 
      name: 'Kayla IR', 
      role: 'AI Investor Relations',
      detail: 'Financial reporting automation, VC pipeline management, investor-ready materials'
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            The <span className="text-mansagold">Team</span>
          </h2>
          <p className="text-white/50 text-sm">Human Leadership + AI Workforce</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-black/80 border-2 border-mansagold h-full">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-1 bg-mansagold/30 text-mansagold border-mansagold font-bold text-xs">
                    Founder
                  </Badge>
                  <h3 className="text-xl font-bold text-white">{founder.name}</h3>
                  <p className="text-mansagold font-bold text-sm mb-3">{founder.title}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {founder.background.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-white font-medium text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-mansagold mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-4 p-3 bg-mansagold/20 rounded-xl border-l-4 border-mansagold">
                <p className="text-white font-semibold italic text-sm">"{founder.quote}"</p>
              </blockquote>

              <div className="mt-4 flex gap-3">
                <Badge variant="outline" className="border-mansagold text-mansagold font-bold text-xs">
                  <Linkedin className="w-3 h-3 mr-1" /> LinkedIn
                </Badge>
                <Badge variant="outline" className="border-mansagold text-mansagold font-bold text-xs">
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
            className="space-y-4"
          >
            {/* Core Capabilities */}
            <Card className="p-4 bg-black/60 border-white/10">
              <h3 className="text-sm font-bold text-white mb-3">Core Capabilities</h3>
              <div className="space-y-2">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-mansagold/20 rounded-lg flex items-center justify-center">
                      <cap.icon className="w-4 h-4 text-mansagold" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{cap.label}</div>
                      <div className="text-white/60 text-xs">{cap.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Advisory Network */}
            <Card className="p-4 bg-black/60 border-white/10">
              <h3 className="text-sm font-bold text-white mb-3">Advisory Network</h3>
              <div className="space-y-2">
                {advisors.map((advisor, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="text-white font-semibold text-sm">{advisor.role}</div>
                    <Badge variant="outline" className="border-mansagold/30 text-mansagold text-xs">
                      {advisor.expertise}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* AI Workforce Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="p-5 bg-black/60 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">AI Workforce</h3>
              <span className="text-purple-400/70 text-xs font-medium ml-1">Powered by Kayla — 28 Agentic AI Employees</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {aiWorkforce.map((agent, i) => (
                <div key={i} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <agent.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{agent.name}</div>
                      <div className="text-purple-300 text-xs">{agent.role}</div>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{agent.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide12Team;
