import React, { useState } from 'react';
import { DirectoryPartner } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Copy, Video, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface VideoScriptGeneratorProps {
  partner: DirectoryPartner;
}

type ScriptLength = '30sec' | '60sec' | '90sec';

const VideoScriptGenerator: React.FC<VideoScriptGeneratorProps> = ({ partner }) => {
  const [length, setLength] = useState<ScriptLength>('60sec');
  const [copied, setCopied] = useState(false);

  const scripts: Record<ScriptLength, { duration: string; wordCount: string; script: string }> = {
    '30sec': {
      duration: '30 seconds',
      wordCount: '~75 words',
      script: `Hey family! I want to tell you about 1325.ai.

It's an economic operating system built for Black-owned businesses - and right now, it's FREE to join.

We're talking $700 worth of business tools for just $100 a month. That's 7 times your investment back.

Get discovered by conscious consumers, connect with other Black businesses, and build real wealth.

Sign up free using my link in the bio before September 2026.

Let's circulate that wealth together!`,
    },
    '60sec': {
      duration: '60 seconds',
      wordCount: '~150 words',
      script: `What's up family! I need to share something important with you.

${partner.directory_name} has partnered with 1325.ai - and if you're a Black business owner, you need to pay attention.

1325.ai is an economic operating system designed specifically for us. Here's what you get:

You get discovered by consumers who are ACTIVELY looking to support Black-owned businesses.

You get B2B matching to find partners, suppliers, and customers within our community.

You get access to Susu circles - that's community-powered savings without needing a bank.

And the value? $700 worth of business tools for just $100 a month. That's a 7x return on your investment.

But here's the thing - right now, it's FREE. You can become a Founding Member until September 2026.

Click the link in my bio to sign up. Use my partner code: ${partner.referral_code}

Let's build generational wealth together. I'll see you inside!`,
    },
    '90sec': {
      duration: '90 seconds',
      wordCount: '~225 words',
      script: `Family, let me tell you something that could change your business.

I've been looking for ways to grow my network, find new customers, and connect with other Black-owned businesses. And I found 1325.ai.

${partner.directory_name} just partnered with them, and I had to share this with you.

So what is 1325.ai? It's an economic operating system - not just a directory, but real tools built specifically for Black-owned businesses.

Let me break down what you get:

First, visibility. You get discovered by conscious consumers who are actively looking to support Black businesses. These aren't random people - these are people with intent.

Second, B2B connections. Find partners, suppliers, and customers within our community. Imagine getting your supplies from another Black-owned business, and they're getting theirs from another. That's how we circulate wealth.

Third, Susu circles. Community-powered rotating savings. No bank, no credit check. Just our community supporting each other.

And the numbers? $700 worth of business tools for just $100 a month. That's 7 times your money back.

But here's the best part - right now, it's completely FREE. Sign up before September 1, 2026 and you're locked in as a Founding Member with lifetime benefits.

Click the link in my bio. Use partner code ${partner.referral_code}.

Don't sleep on this. Let's build generational wealth together.

See you inside!`,
    },
  };

  const currentScript = scripts[length];

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(currentScript.script);
      setCopied(true);
      toast.success('Script copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Video className="w-5 h-5 text-amber-400" />
          Video Script Template
        </CardTitle>
        <CardDescription className="text-slate-400">
          Ready-to-record scripts for promo videos. Choose your length and customize as needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Length Selector */}
        <div className="space-y-2">
          <Label className="text-amber-400 font-semibold">Video Length</Label>
          <Select value={length} onValueChange={(v: ScriptLength) => setLength(v)}>
            <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30sec">30 Seconds (Quick Hit)</SelectItem>
              <SelectItem value="60sec">60 Seconds (Standard)</SelectItem>
              <SelectItem value="90sec">90 Seconds (Deep Dive)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Script Info */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{currentScript.duration}</span>
          </div>
          <div className="text-slate-500">|</div>
          <div className="text-slate-400">{currentScript.wordCount}</div>
        </div>

        {/* Script Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-amber-400 font-semibold">Script</Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyScript}
              className="h-7 text-xs"
            >
              {copied ? <Check className="w-3 h-3 mr-1 text-green-400" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Textarea
            value={currentScript.script}
            readOnly
            className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[300px] text-sm leading-relaxed"
          />
        </div>

        {/* Actions */}
        <Button
          onClick={copyScript}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Script'}
        </Button>

        {/* Tips */}
        <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
          <h4 className="font-medium text-amber-400 mb-2">🎬 Recording Tips</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• <strong>Lighting:</strong> Face a window or use a ring light</li>
            <li>• <strong>Audio:</strong> Record in a quiet space; use a lapel mic if possible</li>
            <li>• <strong>Energy:</strong> Speak with enthusiasm - this is exciting news!</li>
            <li>• <strong>CTA:</strong> Point to where your link is (bio, pinned comment, etc.)</li>
            <li>• <strong>Authenticity:</strong> Feel free to modify the script to match your voice</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoScriptGenerator;
