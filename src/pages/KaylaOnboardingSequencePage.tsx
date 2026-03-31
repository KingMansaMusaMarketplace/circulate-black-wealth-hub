import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Sparkles, Mail, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emails = [
  {
    label: 'Day 0 — Welcome',
    icon: Sparkles,
    subject: 'Your AI Employee just clocked in ✨',
    body: `Hi [Business Name] Team,

Welcome aboard — Kayla is officially on the clock. 🎉

Your Autonomous AI Employee has already started working. Here's what she did in her first 60 seconds:

✦ Scanned your customer reviews and drafted 3 professional responses (waiting for your approval in the Kayla AI dashboard)
✦ Identified 2 potential B2B partners in your area
✦ Began monitoring your customer activity for churn signals

Your Kayla AI Dashboard is live. Visit it anytime to review, approve, or customize her work:

→ Open Your Dashboard: https://1325.ai/business-dashboard (Kayla AI tab)

She learns your brand voice over time — the more you approve or edit, the sharper she gets.

No interviews. No payroll tax. No days off. Just results.

Welcome to the future of business operations,

Thomas D. Bowling
Founder & Chief Architect, 1325.ai`
  },
  {
    label: 'Day 3 — First Value',
    icon: Users,
    subject: 'Kayla found 5 B2B partners for you 🤝',
    body: `Hi [Business Name] Team,

Kayla has been busy. Here's her 72-hour report:

📋 REVIEW MANAGEMENT
• 8 customer reviews analyzed
• 8 professional responses drafted
• Average response time: 4 seconds (vs. industry average: 24 hours)

🤝 B2B MATCHMAKING
• 5 complementary businesses identified in your area
• 2 are ready to connect — approve matches in your dashboard

⚠️ CHURN PREDICTION
• 1 at-risk customer flagged
• Kayla drafted a personalized re-engagement message (pending your approval)

📱 CONTENT GENERATION
• 3 social media posts created for your brand
• Optimized for engagement based on your industry benchmarks

Every action Kayla takes is tracked by the Verified Wealth Ticker — your economic impact is growing.

→ Review Kayla's Work: https://1325.ai/business-dashboard

She's just getting started.

Thomas D. Bowling
Founder & Chief Architect, 1325.ai`
  },
  {
    label: 'Day 7 — ROI Report',
    icon: TrendingUp,
    subject: 'Your first week with Kayla — the numbers are in 📊',
    body: `Hi [Business Name] Team,

Your first week with Kayla is complete. Here's the ROI summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 KAYLA'S WEEK 1 PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reviews Handled:          18 responses drafted
B2B Matches Found:         7 partner opportunities
Churn Alerts:              3 at-risk customers flagged
Content Created:           5 social posts generated
Estimated Hours Saved:    12 hours of manual work

💰 YOUR INVESTMENT:        $149/mo (Pro plan)
⏱️ HOURS SAVED:            12 hours
📈 EFFECTIVE RATE:          $3.10/hour

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The "Mansa Musa" Multiplier:
Your Verified Wealth Ticker shows a 6.0x economic impact from your Kayla-powered operations. Every dollar you invest circulates back through our community.

Kayla is learning your business every day. Next week, she'll be even sharper — better responses, smarter matches, earlier churn detection.

→ See Full Report: https://1325.ai/business-dashboard

To our collective success,

Thomas D. Bowling
Founder & Chief Architect, 1325.ai`
  }
];

const KaylaOnboardingSequencePage = () => {
  const { toast } = useToast();
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (idx: number) => {
    const email = emails[idx];
    const fullText = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIdx(idx);
    toast({
      title: "Copied!",
      description: `${email.label} email copied to clipboard`,
    });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0d1a] to-[#030712] p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-emerald-600 rounded-full p-6 shadow-2xl border-4 border-yellow-400/30">
                <Mail className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
            Kayla Onboarding Sequence
          </h1>
          <p className="text-lg font-medium text-white/70">
            3-email drip sequence to retain $100/mo subscribers 📧
          </p>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/60 border border-white/10 mb-6">
            {emails.map((email, idx) => {
              const Icon = email.icon;
              return (
                <TabsTrigger
                  key={idx}
                  value={String(idx)}
                  className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-white/60 gap-2 text-xs sm:text-sm"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{email.label}</span>
                  <span className="sm:hidden">Day {idx === 0 ? '0' : idx === 1 ? '3' : '7'}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {emails.map((email, idx) => (
            <TabsContent key={idx} value={String(idx)}>
              <div className="flex justify-center mb-6">
                <Button
                  onClick={() => handleCopy(idx)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-lg px-10 py-6 shadow-2xl hover:shadow-[0_0_50px_rgba(212,168,67,0.5)] hover:scale-105 transition-all border-4 border-yellow-400/30 font-bold gap-3"
                >
                  {copiedIdx === idx ? <><Check className="w-6 h-6 animate-pulse" /> ✅ Copied!</> : <><Copy className="w-6 h-6" /> 📋 Copy {email.label}</>}
                </Button>
              </div>

              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10">
                <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-xs text-white/40 font-medium mb-1">SUBJECT</p>
                  <p className="text-white font-semibold">{email.subject}</p>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-white text-base leading-relaxed p-6 bg-slate-800/50 rounded-xl border-2 border-white/10 shadow-inner">
                  {email.body}
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-base font-medium text-white/50">
            💡 These 3 emails are sent automatically after a business activates Kayla at $100/mo
          </p>
        </div>
      </div>
    </div>
  );
};

export default KaylaOnboardingSequencePage;
