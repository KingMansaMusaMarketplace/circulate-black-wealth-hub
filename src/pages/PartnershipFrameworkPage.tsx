import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Handshake, 
  Users, 
  Building2, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Target,
  Clock,
  Shield,
  MessageSquare,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnershipFrameworkPage: React.FC = () => {
  const navigate = useNavigate();

  const partnershipOptions = [
    {
      type: 'Strategic Advisory',
      description: 'Marlon joins advisory board and facilitates 776 introduction',
      valueToMMM: ['776 VC access', 'Regional market expertise', 'Community credibility'],
      valueToPartner: ['Advisory equity/fees', 'Access to MMM technology', 'Platform presence'],
      structure: '6-month agreement with defined milestones',
      risk: 'low',
      priority: 'high'
    },
    {
      type: 'Affiliate Partnership',
      description: 'Together We Save becomes MMM affiliate in Chicago market',
      valueToMMM: ['Local business referrals', 'Community trust', 'Market expansion'],
      valueToPartner: ['Commission on signups', 'Loyalty program access', 'Co-branding'],
      structure: 'Revenue share model (15-25% of subscription fees)',
      risk: 'low',
      priority: 'medium'
    },
    {
      type: 'White-Label / Technology Partner',
      description: 'MMM provides technology backbone for Together We Save',
      valueToMMM: ['Additional revenue stream', 'Expanded reach', 'Market validation'],
      valueToPartner: ['Modern platform upgrade', 'All features access', 'Technical support'],
      structure: 'Technology licensing fee (SaaS model)',
      risk: 'medium',
      priority: 'medium'
    },
    {
      type: 'Merger Consideration',
      description: 'Full integration of Together We Save into MMM',
      valueToMMM: ['Chicago market presence', 'Primous network', 'User base'],
      valueToPartner: ['Equity stake in MMM', 'Continued leadership', 'Larger platform'],
      structure: 'Equity + earnout based on performance',
      risk: 'high',
      priority: 'low'
    },
  ];

  const negotiationTerms = [
    {
      term: '776 Introduction Timeline',
      recommendation: 'Concrete milestone within 30 days of agreement',
      rationale: 'The 776 connection is the primary strategic value'
    },
    {
      term: 'Exclusivity Period',
      recommendation: 'Non-exclusive or limited geographic exclusivity',
      rationale: 'Maintain flexibility for other partnerships'
    },
    {
      term: 'Performance Milestones',
      recommendation: 'Tie benefits to measurable outcomes',
      rationale: 'Ensures both parties deliver value'
    },
    {
      term: 'IP Protection',
      recommendation: 'Clear ownership of patent-pending technology',
      rationale: 'CMAL and other innovations must remain MMM property'
    },
  ];

  const dueDiligence = [
    { category: '776 Connection', questions: [
      "What is Marlon Jr.'s specific role at 776?",
      "Has he mentioned MMM or Together We Save to 776?",
      "Can he facilitate a direct introduction to investment partners?"
    ]},
    { category: 'TWS Business', questions: [
      "How many active businesses are on Together We Save?",
      "What is their current revenue model?",
      "What technology stack are they using?"
    ]},
    { category: 'Partnership Intent', questions: [
      "What does 'working together' mean specifically to you?",
      "Are you looking for technology, merger, or referral relationship?",
      "What timeline are you envisioning?"
    ]},
  ];

  const redFlags = [
    "Vague promises about 776 introduction without specifics",
    "Requests for significant equity without clear value delivery",
    "Pressure to move quickly without due diligence",
    "Unwillingness to put terms in writing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-[hsl(210,100%,12%)] to-[hsl(210,100%,8%)]">
      <Helmet>
        <title>Partnership Framework - Mansa Musa Marketplace</title>
        <meta name="description" content="Strategic partnership framework for Mansa Musa Marketplace business development." />
      </Helmet>

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="h-4 w-px bg-white/20" />
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">
              <Handshake className="w-3 h-3 mr-1" />
              Partnership Framework
            </Badge>
          </div>
          <Badge variant="outline" className="border-white/30 text-white/70">
            <FileText className="w-3 h-3 mr-1" />
            Internal Document
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Together We Save <span className="text-mansagold">Partnership Framework</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Strategic options and negotiation framework for partnership with Marlon Primous
          </p>
        </motion.div>

        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-mansagold/20 to-white/5 border-mansagold/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-mansagold" />
              Executive Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-mansagold mb-2">The Opportunity</h3>
                <p className="text-white/80">
                  Marlon Primous of Together We Save has expressed interest in collaboration. His son Marlon Jr. 
                  works at Seven Seven Six (776), Alexis Ohanian's venture capital firm with ~$1B AUM.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mansagold mb-2">Strategic Priority</h3>
                <p className="text-white/80">
                  The primary value is the potential 776 introduction. Structure any partnership to ensure this 
                  connection is facilitated with clear milestones and accountability.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Partnership Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-mansagold" />
            Partnership Options Matrix
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {partnershipOptions.map((option, index) => (
              <Card 
                key={index} 
                className={`p-6 bg-white/5 border-white/10 ${
                  option.priority === 'high' ? 'ring-2 ring-mansagold/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{option.type}</h3>
                  <div className="flex gap-2">
                    <Badge className={`${
                      option.priority === 'high' ? 'bg-green-500/20 text-green-400' :
                      option.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {option.priority} priority
                    </Badge>
                    <Badge className={`${
                      option.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                      option.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {option.risk} risk
                    </Badge>
                  </div>
                </div>
                <p className="text-white/70 mb-4">{option.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-mansagold mb-2">Value to MMM</h4>
                    <ul className="space-y-1">
                      {option.valueToMMM.map((v, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-400" /> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-mansagold mb-2">Value to Partner</h4>
                    <ul className="space-y-1">
                      {option.valueToPartner.map((v, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-blue-400" /> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60">
                    <span className="font-semibold text-white">Structure:</span> {option.structure}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Key Terms to Negotiate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-mansagold" />
            Key Terms to Negotiate
          </h2>
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="space-y-6">
              {negotiationTerms.map((item, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="w-8 h-8 bg-mansagold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-mansagold font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.term}</h3>
                    <p className="text-mansagold mb-1">
                      <ArrowRight className="w-4 h-4 inline mr-1" />
                      {item.recommendation}
                    </p>
                    <p className="text-white/60 text-sm">{item.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Due Diligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-mansagold" />
            Meeting Preparation: Questions to Ask
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dueDiligence.map((category, index) => (
              <Card key={index} className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-mansagold mb-4">{category.category}</h3>
                <ul className="space-y-3">
                  {category.questions.map((q, i) => (
                    <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-mansagold mt-2 flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Red Flags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <Card className="p-6 bg-red-500/10 border-red-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Red Flags to Watch For
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-2 text-white/80">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {flag}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recommended Approach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 bg-gradient-to-r from-mansablue to-mansablue-dark border-mansagold/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-mansagold" />
              Recommended Approach
            </h2>
            <ol className="space-y-4">
              {[
                'Take the meeting with openness but clear objectives',
                'Lead with Strategic Advisory option — lowest risk, clearest path to 776',
                'Get specifics on Marlon Jr.\'s role and willingness to make introduction',
                'Tie any agreement to concrete milestones with the 776 introduction as primary',
                'Avoid equity discussions until 776 value is demonstrated',
                'Put everything in writing before proceeding'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <span className="w-6 h-6 bg-mansagold/20 rounded-full flex items-center justify-center text-mansagold font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PartnershipFrameworkPage;
