import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Shield, Users, DollarSign, Clock, AlertTriangle, ArrowLeftRight } from 'lucide-react';

const susuFAQs = [
  {
    question: "What is a Susu Circle?",
    answer: "A Susu Circle is a traditional rotating savings group rooted in African and Caribbean culture. Members pool money together regularly, and each period one member receives the full pot. It's a community-driven way to save and access larger sums without traditional banking.",
    icon: Users
  },
  {
    question: "How are payouts calculated and distributed?",
    answer: "Each member contributes the same amount every cycle (weekly, bi-weekly, or monthly). The total pot equals contribution × number of members. For example, in a 10-member circle with $100 contributions, each payout is $1,000. Members receive payouts in their assigned position order.",
    icon: DollarSign
  },
  {
    question: "Is my money safe? How does escrow work?",
    answer: "Absolutely. All contributions are held in our secure digital escrow system—protected by U.S. Patent Pending technology (63/969,202). Funds are only released to the designated recipient when all members have contributed for that round. No single person can access the pool prematurely.",
    icon: Shield
  },
  {
    question: "What happens if someone misses a contribution?",
    answer: "Circle integrity is crucial. If a member misses a contribution, they may be removed from the circle and forfeit their payout position. The circle can continue with remaining members, or the organizer may pause until the situation is resolved. We recommend only joining circles with people you trust.",
    icon: AlertTriangle
  },
  {
    question: "Can I leave a circle early?",
    answer: "You can request to leave, but only after you've fulfilled your contribution obligations. If you've already received your payout, you must continue contributing until the circle completes. Early departure without meeting obligations may affect your platform trust score.",
    icon: ArrowLeftRight
  },
  {
    question: "How long does a full cycle take?",
    answer: "The duration depends on the circle's frequency and member count. A 10-member monthly circle takes 10 months to complete. A weekly circle with 5 members finishes in 5 weeks. You'll see projected completion dates when viewing circle details.",
    icon: Clock
  },
  {
    question: "What is the platform fee?",
    answer: "We charge a 1.5% platform fee on payouts to cover secure escrow services, fraud protection, and platform maintenance. This fee is deducted from the payout amount. For a $1,000 payout, the fee would be $15, and you'd receive $985.",
    icon: DollarSign
  },
  {
    question: "How do I know when it's my turn to receive?",
    answer: "Your payout position is assigned when you join (based on join order) or randomly if the circle chooses. You can always see your position in the Member List, along with projected payout dates. You'll also receive notifications before your turn.",
    icon: Users
  }
];

const SusuFAQ: React.FC = () => {
  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-mansagold/30 to-amber-500/20 border border-mansagold/40 mx-auto mb-3">
          <HelpCircle className="w-6 h-6 text-mansagold" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Frequently Asked Questions
        </CardTitle>
        <p className="text-slate-400 mt-2">
          Everything you need to know about Susu Circles
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {susuFAQs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-slate-900/50 border border-white/10 rounded-xl px-4 hover:border-mansagold/30 transition-all duration-300"
            >
              <AccordionTrigger className="text-left py-4 hover:no-underline group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-mansagold/10 group-hover:bg-mansagold/20 transition-colors">
                    <faq.icon className="w-4 h-4 text-mansagold" />
                  </div>
                  <span className="text-white font-medium group-hover:text-mansagold transition-colors">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 pb-4 pl-12 pr-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Trust Badge */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-mansagold/10 to-amber-900/10 border border-mansagold/20">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-mansagold flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">Patent-Protected Escrow Technology</p>
              <p className="text-slate-400 text-sm">
                Your contributions are secured by our proprietary digital escrow system, ensuring transparent and trustworthy community savings.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SusuFAQ;
