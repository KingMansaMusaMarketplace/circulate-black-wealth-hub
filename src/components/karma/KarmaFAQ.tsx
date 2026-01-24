import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Sparkles, TrendingDown, TrendingUp, Gift, Shield, Clock, Star, Target } from 'lucide-react';

const karmaFAQs = [
  {
    question: "What is Economic Karma?",
    answer: "Economic Karma is a trust and engagement score that reflects your participation in the Black economic ecosystem. It measures how actively you support Black-owned businesses, contribute to the community, and maintain reliable behavior on the platform.",
    icon: Sparkles
  },
  {
    question: "How do I earn karma points?",
    answer: "You earn karma by: making purchases at partner businesses (+2-10 points), leaving helpful reviews (+3 points), referring friends who sign up (+5 points), completing your profile (+10 points), attending community events (+5 points), and participating in Susu Circles (+3 points per successful round).",
    icon: TrendingUp
  },
  {
    question: "Why does my karma decay monthly?",
    answer: "A 5% monthly decay encourages consistent engagement with the community. The decay only applies if you haven't been active (made purchases, left reviews, etc.) in the past 30 days. This ensures karma scores reflect current engagement, not just past activity.",
    icon: TrendingDown
  },
  {
    question: "What are the benefits of high karma?",
    answer: "High karma unlocks: priority booking slots, exclusive discounts at partner businesses, featured status in community leaderboards, eligibility for special rewards and giveaways, trusted member badge on your profile, and better payout positions in Susu Circles.",
    icon: Gift
  },
  {
    question: "Can my karma drop below a certain point?",
    answer: "Yes, there's a floor of 10 points. Your karma can never drop below this minimum, ensuring you always have a foundation to rebuild from. Think of it as the platform's way of giving everyone a second chance.",
    icon: Shield
  },
  {
    question: "How often is karma calculated?",
    answer: "Karma updates happen in real-time for positive actions (purchases, reviews, referrals). The 5% decay is applied once monthly, on the same day each month. You'll receive a notification 3 days before decay to give you time to stay active.",
    icon: Clock
  },
  {
    question: "What causes karma to decrease?",
    answer: "Karma decreases from: monthly inactivity decay (-5%), cancelling confirmed bookings (-3 points), filing disputes that are ruled against you (-5 points), policy violations (-10+ points), and receiving multiple negative reviews as a business owner.",
    icon: Target
  },
  {
    question: "How can I quickly boost my karma score?",
    answer: "The fastest ways to boost karma: Complete your full profile (+10), make your first purchase (+5 bonus), refer 3 friends (+15 total), leave detailed reviews (+3 each), and join a Susu Circle. Consistency matters more than one-time actions!",
    icon: Star
  }
];

const KarmaFAQ: React.FC = () => {
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
          Everything you need to know about Economic Karma
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {karmaFAQs.map((faq, index) => (
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

        {/* Pro Tip Badge */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-mansagold/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-mansagold flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">Stay Active, Stay Rewarded</p>
              <p className="text-slate-400 text-sm">
                Just one purchase or review per month prevents karma decay. Small consistent actions lead to big rewards!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarmaFAQ;
