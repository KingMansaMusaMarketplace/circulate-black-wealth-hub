import React, { useState } from 'react';
import { DirectoryPartner } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplatesGeneratorProps {
  partner: DirectoryPartner;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  purpose: string;
}

const EmailTemplatesGenerator: React.FC<EmailTemplatesGeneratorProps> = ({ partner }) => {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>('announcement');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates: EmailTemplate[] = [
    {
      id: 'announcement',
      name: 'New Partnership Announcement',
      purpose: 'Introduce 1325.AI to your network',
      subject: `Exciting News: ${partner.directory_name} Partners with 1325.AI`,
      body: `Hello,

I'm excited to share that ${partner.directory_name} has partnered with 1325.AI - the Economic Operating System designed specifically for community businesses.

💰 THE VALUE: $700/month in business tools for just $100/month - that's a 7x return on your investment!

This platform offers incredible tools to help your business thrive:

✅ Get discovered by conscious consumers actively seeking community businesses
✅ Connect with other businesses for B2B partnerships and opportunities  
✅ Access community-powered financing through Susu savings circles
✅ Build customer loyalty with integrated rewards programs
✅ Track your economic impact on the community

As a member of our community, you can sign up using our exclusive link:
${partner.referral_link}

🔥 Founding 100 Offer: the first 100 businesses lock in Pro at $149/mo — forever (regular price $249/mo). Spots are limited!

Questions? Reply to this email or visit 1325.AI to learn more.

Best regards,
${partner.directory_name}`,
    },
    {
      id: 'reminder',
      name: 'Follow-Up Reminder',
      purpose: 'Re-engage members who haven\'t signed up yet',
      subject: 'Don\'t Miss Out: $700/mo in Tools for $100/mo at 1325.AI',
      body: `Hi there,

A quick reminder about 1325.AI - the platform helping community businesses grow and connect.

💰 THE VALUE: Members get $700/month worth of business tools for just $100/month. That's a 7x ROI!

If you haven't signed up yet, now is the perfect time. Founding 100 status (Pro at $149/mo locked in forever — only 100 spots) includes:

🌟 Priority listing in the business directory
🌟 Early access to new features
🌟 Higher revenue share on B2B transactions
🌟 Founding Member badge on your profile

Join hundreds of businesses already on the platform:
${partner.referral_link}

Your partner code: ${partner.referral_code}

Let me know if you have any questions!

Best,
${partner.directory_name}`,
    },
    {
      id: 'success-story',
      name: 'Success Story Share',
      purpose: 'Share a win to encourage signups',
      subject: 'How 1325.AI is Helping Black Businesses Grow (7x ROI)',
      body: `Hello,

I wanted to share some exciting news about our partnership with 1325.AI.

💰 THE VALUE: $700/month in business benefits for just $100/month = 7x ROI

Since joining, our community members have:
• Connected with new B2B partners and suppliers
• Saved thousands through Susu circles
• Increased visibility to conscious consumers
• Built stronger customer loyalty

The platform tracks economic impact using their CMAL (Circulatory Multiplier Attribution Logic) system - showing how every dollar spent at community businesses multiplies through the community.

Ready to be part of this movement? Claim a Founding 100 spot:
${partner.referral_link}

Together, we're building generational wealth.

Best regards,
${partner.directory_name}`,
    },
    {
      id: 'deadline',
      name: 'Deadline Urgency',
      purpose: 'Create urgency before the Founding 100 spots sell out',
      subject: '⏰ Last Chance: Lock In Pro at $149/mo Forever — Only 100 Spots',
      body: `IMPORTANT: Time-Sensitive Opportunity

The Founding 100 program at 1325.AI is filling up fast. Only the first 100 businesses lock in Pro at $149/mo — forever.

After 100 spots are claimed, Pro is $249/mo.

💰 THE VALUE: $700/month in business tools for $149/month = 4.7x ROI, locked in for life

As a Founding 100 member, you get:
✓ Pro tier locked in at $149/mo forever (vs. $249 regular)
✓ Priority directory placement
✓ Founding Member badge
✓ Early access to all new features
✓ Higher commission rates

Don't miss this. Claim your spot now:
${partner.referral_link}

This is a once-in-a-lifetime chance to be part of building the economic infrastructure for our community.

Act now,
${partner.directory_name}`,
    },
  ];

  const copyToClipboard = async (template: EmailTemplate, field: 'subject' | 'body' | 'both') => {
    let text = '';
    if (field === 'subject') {
      text = template.subject;
    } else if (field === 'body') {
      text = template.body;
    } else {
      text = `Subject: ${template.subject}\n\n${template.body}`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(`${template.id}-${field}`);
      toast.success(`${field === 'both' ? 'Email template' : field.charAt(0).toUpperCase() + field.slice(1)} copied!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const openInMailClient = (template: EmailTemplate) => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Mail className="w-5 h-5 text-amber-400" />
          Email Templates
        </CardTitle>
        <CardDescription className="text-slate-400">
          Pre-written emails personalized with your referral link. Copy and send to your network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="border border-slate-700/50 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <h4 className="font-medium text-white">{template.name}</h4>
                  <p className="text-sm text-slate-400">{template.purpose}</p>
                </div>
              </div>
              {expandedTemplate === template.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedTemplate === template.id && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-amber-400">Subject Line</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(template, 'subject')}
                      className="h-7 text-xs"
                    >
                      {copiedId === `${template.id}-subject` ? (
                        <Check className="w-3 h-3 mr-1 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-sm text-slate-300">
                    {template.subject}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-amber-400">Email Body</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(template, 'body')}
                      className="h-7 text-xs"
                    >
                      {copiedId === `${template.id}-body` ? (
                        <Check className="w-3 h-3 mr-1 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    readOnly
                    value={template.body}
                    className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[200px] text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    onClick={() => copyToClipboard(template, 'both')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                  >
                    {copiedId === `${template.id}-both` ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy Full Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openInMailClient(template)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Open in Email App
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesGenerator;
