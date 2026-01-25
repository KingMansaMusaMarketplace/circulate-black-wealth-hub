import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, DollarSign, Users, Clock, Shield, Zap } from 'lucide-react';

const faqItems = [
  {
    id: 'how-it-works',
    icon: Zap,
    question: 'How does the Partner Referral Program work?',
    answer: 'As a Directory Partner, you receive a unique referral link to share with businesses in your network. When a business signs up through your link and makes their first payment, you earn a $5 flat fee plus 10% revenue share on any paid upgrades they purchase. Your earnings accumulate in your Partner Dashboard.'
  },
  {
    id: 'earnings',
    icon: DollarSign,
    question: 'When do I get paid?',
    answer: 'Payouts are processed monthly with a $50 minimum threshold. Commissions are credited to your balance only after a referred business makes their first successful payment, ensuring the program remains cash-flow positive for everyone. You can request a payout anytime once you reach the threshold.'
  },
  {
    id: 'referral-tracking',
    icon: Users,
    question: 'How are referrals tracked?',
    answer: 'Your unique referral link contains a tracking code that automatically attributes signups to your account. We track the entire journey from click → signup → first payment → ongoing revenue. You can view real-time stats including click-through rates, conversion rates, and earnings in your Partner Dashboard.'
  },
  {
    id: 'approval-time',
    icon: Clock,
    question: 'How long does partner approval take?',
    answer: 'Most applications are reviewed within 24-48 hours. We verify that your directory is active and aligned with our mission of supporting Black-owned businesses. You\'ll receive an email notification once your application is approved or if we need additional information.'
  },
  {
    id: 'founding-partner',
    icon: Shield,
    question: 'What is "Founding Partner" status?',
    answer: 'Founding Partners are early adopters who join during our growth phase. Benefits include priority support, early access to new features, higher revenue share tiers as we scale, and recognition on our Partners page. This status is exclusive to partners who join before we reach 10,000 businesses.'
  },
  {
    id: 'embed-widget',
    icon: Zap,
    question: 'Can I embed 1325.AI on my website?',
    answer: 'Yes! Active partners get access to an embed widget that displays 1325.AI businesses directly on your website. The widget automatically includes your referral tracking, so any signups from embedded listings count toward your earnings. Find the embed code in your Partner Dashboard settings.'
  },
  {
    id: 'multiple-directories',
    icon: Users,
    question: 'Can I refer businesses from multiple directories?',
    answer: 'Absolutely. Your referral link works for any business you refer, regardless of how many directories or networks you manage. We encourage partners to leverage all their business relationships. Each referred business is tracked individually in your dashboard.'
  },
  {
    id: 'payment-methods',
    icon: DollarSign,
    question: 'How will I receive my payouts?',
    answer: 'Payouts are processed via bank transfer (ACH) or PayPal, depending on your preference. You can configure your payment details in the Partner Settings section of your dashboard. All payments are issued in USD.'
  }
];

interface PartnerFAQProps {
  className?: string;
  variant?: 'compact' | 'full';
}

const PartnerFAQ: React.FC<PartnerFAQProps> = ({ className = '', variant = 'full' }) => {
  const displayItems = variant === 'compact' ? faqItems.slice(0, 4) : faqItems;

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <HelpCircle className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Partner FAQ</h3>
          <p className="text-sm text-slate-400">Common questions about the referral program</p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="space-y-3">
        {displayItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden px-0 data-[state=open]:border-amber-500/30"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3 text-left">
                <item.icon className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-white font-medium group-hover:text-amber-300 transition-colors">
                  {item.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0">
              <div className="pl-8 text-slate-300 leading-relaxed">
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Trust indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
        <Shield className="h-4 w-4 text-emerald-500" />
        <span>Transparent • Fair • Community-First</span>
      </div>
    </div>
  );
};

export default PartnerFAQ;
