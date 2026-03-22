import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Mail, Sparkles, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emailText = `Subject: Meet Kayla: Your New AI Employee is Ready to Work

Hi [Business Name] Team,

For 40 years, I've been building tools to empower our community. Today, I am proud to introduce the most advanced worker we've ever hired at 1325.ai: Kayla.

Kayla isn't just a search tool. She is an Autonomous AI Employee built specifically to run the backend of your business so you can focus on your craft.

Starting today, Kayla can handle:

✦ 24/7 Review Management: She drafts professional, on-brand responses to every customer review in seconds.

✦ B2B Matchmaking: She scans our network of 33,000+ businesses to find your next supplier or partner.

✦ Churn Prediction: She identifies at-risk customers before they leave, helping you protect your revenue.

✦ Content Generation: She creates social posts and promotions to keep your brand active on autopilot.

The "Mansa Musa" Multiplier:
Every dollar processed through Kayla is tracked by our Verified Wealth Ticker, proving the 6.0x economic impact we are making together.

Activate your AI Employee for just $100/mo. No interviews, no payroll tax, and no days off.

→ Activate Kayla Now: https://1325.ai/subscription?tier=kayla_ai

To our collective success,

Thomas D. Bowling
Founder & Chief Architect, 1325.ai`;

const linkedInText = `🚀 Meet Kayla: The AI Employee That Never Clocks Out

For 40 years, I've been building tools to empower our community. Today, I'm proud to introduce the most advanced worker we've ever hired at 1325.ai: Kayla.

Kayla isn't a chatbot. She's an Autonomous AI Employee — built to run the backend of your business so you can focus on your craft.

What she does:
✦ 24/7 Review Management — professional responses drafted in seconds
✦ B2B Matchmaking — scans 33,000+ businesses to find your next partner
✦ Churn Prediction — catches at-risk customers before they leave
✦ Content Generation — social posts & promotions on autopilot

The "Mansa Musa" Multiplier: Every dollar through Kayla is tracked by our Verified Wealth Ticker — proving the 6.0x economic impact we're making together.

$100/mo. No interviews. No payroll tax. No days off.

Activate your AI Employee → https://1325.ai/subscription?tier=kayla_ai

#AI #BlackBusiness #1325AI #CommunityWealth #Entrepreneurship`;

const KaylaAnnouncementPage = () => {
  const { toast } = useToast();
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = React.useState(false);

  const handleCopy = (text: string, type: 'email' | 'linkedin') => {
    navigator.clipboard.writeText(text);
    const setter = type === 'email' ? setCopiedEmail : setCopiedLinkedIn;
    setter(true);
    toast({
      title: "Copied!",
      description: `${type === 'email' ? 'Email' : 'LinkedIn'} text copied to clipboard`,
    });
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0d1a] to-[#030712] p-8 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full p-6 shadow-2xl border-4 border-yellow-400/30">
                <Sparkles className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Kayla AI Employee — Go-to-Market Announcement
          </h1>
          <p className="text-lg font-medium text-white/70">
            Copy-ready announcement for 33,505 businesses ✨
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/60 border border-white/10 mb-6">
            <TabsTrigger value="email" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-white/60 gap-2">
              <Mail className="w-4 h-4" /> Email Version
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-white/60 gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn Version
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => handleCopy(emailText, 'email')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-xl px-12 py-8 shadow-2xl hover:shadow-[0_0_50px_rgba(212,168,67,0.5)] hover:scale-110 transition-all border-4 border-yellow-400/30 font-bold gap-3"
              >
                {copiedEmail ? <><Check className="w-7 h-7 animate-pulse" /> ✅ Copied!</> : <><Copy className="w-7 h-7" /> 📋 Copy Email</>}
              </Button>
            </div>
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10">
              <pre className="whitespace-pre-wrap font-sans text-white text-lg leading-relaxed p-6 bg-slate-800/50 rounded-xl border-2 border-white/10 shadow-inner">
                {emailText}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="linkedin">
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => handleCopy(linkedInText, 'linkedin')}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xl px-12 py-8 shadow-2xl hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:scale-110 transition-all border-4 border-blue-400/30 font-bold gap-3"
              >
                {copiedLinkedIn ? <><Check className="w-7 h-7 animate-pulse" /> ✅ Copied!</> : <><Copy className="w-7 h-7" /> 📋 Copy LinkedIn Post</>}
              </Button>
            </div>
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10">
              <pre className="whitespace-pre-wrap font-sans text-white text-lg leading-relaxed p-6 bg-slate-800/50 rounded-xl border-2 border-white/10 shadow-inner">
                {linkedInText}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-base font-medium text-white/50">
            💡 Select a version above and click Copy to send to 33,505 listed businesses
          </p>
        </div>
      </div>
    </div>
  );
};

export default KaylaAnnouncementPage;
