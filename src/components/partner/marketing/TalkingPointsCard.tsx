import React, { useState } from 'react';
import { DirectoryPartner } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, MessageSquare, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface TalkingPointsCardProps {
  partner: DirectoryPartner;
}

const TalkingPointsCard: React.FC<TalkingPointsCardProps> = ({ partner }) => {
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('elevator');

  const sections = [
    {
      id: 'elevator',
      title: '30-Second Elevator Pitch',
      icon: '🎤',
      content: `"Have you heard of 1325.AI? It's an economic operating system built specifically for community businesses. You get $700 worth of tools, B2B matching, community financing circles, and you get discovered by conscious consumers. Right now they're running a Founding 100 Offer — the first 100 businesses lock in Pro at just $149 a month, forever. After that it's $249. I can send you my referral link — what's your email?"`,
    },
    {
      id: 'objections',
      title: 'Common Objections & Responses',
      icon: '💬',
      content: `**"I don't have time for another platform."**
→ "That's exactly why this is different. It's not just a directory - it's tools that work for you. The B2B matching alone has connected businesses to new suppliers and customers worth thousands."

**"Why $149? What's the catch?"**
→ "No catch. The first 100 businesses lock in Pro at $149/mo forever as Founding Members. After 100 spots, it goes to the regular $249/mo. Getting in now locks in your rate for life."

**"I already have a website/social media."**
→ "This isn't replacing that - it's amplifying it. Think of it as getting discovered by people actively looking to support community businesses, plus B2B tools your website can't offer."

**"How do I know it's legit?"**
→ "I'm a verified partner. ${partner.directory_name} vetted this before partnering. Plus, they're backed by real technology - Susu circles, economic tracking, the works."`,
    },
    {
      id: 'value',
      title: 'Key Value Points',
      icon: '💰',
      content: `• **$700/month value for $100/month** = 7x ROI on business tools
• **FREE until September 1, 2026** - Founding Member status locked in
• **Get discovered** by consumers actively seeking community businesses
• **B2B marketplace** - find partners, suppliers, customers within the community
• **Susu circles** - community-powered rotating savings (no bank needed)
• **Loyalty tools** - build customer engagement and rewards
• **Economic impact tracking** - see how your business circulates wealth
• **Referred by ${partner.directory_name}** - a trusted partner in our community`,
    },
    {
      id: 'close',
      title: 'Closing the Conversation',
      icon: '🎯',
      content: `**Soft Close:**
"Can I text you my referral link? It takes 5 minutes to sign up."

**Urgency Close:**
"The Founding 100 spots are filling up. Once they're gone, the price jumps from $149 to $249/mo. Getting in now locks your rate forever."

**Referral Close:**
"Know any other Black business owners who should hear about this? I'd love to help them too."

**Your Details:**
• Referral Link: ${partner.referral_link}
• Partner Code: ${partner.referral_code}
• Questions? ${partner.contact_email}`,
    },
  ];

  const copyAllPoints = async () => {
    const allContent = sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(allContent);
      setCopied(true);
      toast.success('All talking points copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const copySection = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${title} copied!`);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Talking Points Card
        </CardTitle>
        <CardDescription className="text-slate-400">
          Quick bullet points for phone calls and in-person conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className="border border-slate-700/50 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium text-white">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="p-4 pt-0 space-y-4">
                <div className="bg-slate-900/60 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copySection(section.content, section.title)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy This Section
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-700/50">
          <Button
            onClick={copyAllPoints}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy All Talking Points'}
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          💡 Practice these points until they feel natural. Authenticity converts better than scripts.
        </p>
      </CardContent>
    </Card>
  );
};

export default TalkingPointsCard;
