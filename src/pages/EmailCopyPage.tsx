import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  recipient: string;
  title: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
}

const emails: EmailTemplate[] = [
  {
    id: 'lovable-anton',
    recipient: 'Anton',
    title: 'Lovable — App Marketplace',
    to: '',
    subject: 'Re: Exclusive Invitation to Lovable App Marketplace - Application Submitted',
    body: `Dear Anton,

Thank you for this incredible honor and opportunity. Being recognized as one of your most active users and selected for the first wave of the Lovable app marketplace is truly humbling.

I'm building 1325.AI - a mission-driven platform focused on circulating community wealth and empowering verified businesses through technology. The platform combines loyalty programs, business discovery, corporate sponsorships, and economic impact tracking to create lasting community wealth.

I've just submitted my application and would be deeply honored to showcase this work to the Lovable community. Your platform has been instrumental in bringing this vision to life, and the opportunity to reach millions of builders is both exciting and meaningful.

Thank you for believing in what we're building and for creating such an empowering platform for developers and entrepreneurs.

With gratitude and respect,

[Your Name]`,
  },
  {
    id: 'winshel',
    recipient: 'Deborah Winshel',
    title: 'Global Head of Social Impact',
    to: 'deborah.winshel@blackrock.com',
    cc: 'socialimpact@blackrock.com',
    subject: 'The Infrastructure Layer for $1.6T in Community Capital — Partnership Inquiry',
    body: `Dear Ms. Winshel,

I'm reaching out because BlackRock's social impact work — particularly your focus on closing wealth gaps through measurable, scalable capital deployment — directly aligns with what we're building at 1325.AI.

We are the agentic commerce protocol for community wealth — the infrastructure layer where AI agents discover, transact, and circulate dollars across an underserved $1.6T market segment. While most AI companies build assistants, we built the rails AI organizations transact on, with 27 patent claims protecting our orchestration layer, transaction ledger, and supply chain graph.

In short: we're not a charity ask. We're the measurement and circulation infrastructure that lets institutional capital prove community impact in real time — something today's ESG frameworks can't do.

I see three potential partnership tracks with BlackRock:

1. Corporate Sponsorship — Gold-tier ($35K/yr) or custom partnership funding verified-business onboarding in priority markets (Chicago, Atlanta, Detroit, Mobile).

2. Social-Impact Pilot — A 12-month co-designed pilot measuring dollar velocity, jobs supported, and community wealth created — auditable data BlackRock can publish.

3. iShares ESG / Sustainable Investing Alignment — 1325.AI as a community-impact data partner, providing the measurement layer your ESG products need.

I've attached a one-page brief outlining the protocol, our patent moat, and partnership economics. I'd value 20 minutes to walk you through the platform and explore where the fit is strongest.

Would the week of [insert date] work for a brief call?

With respect and gratitude,

[Your Full Name]
Founder & CEO, 1325.AI
[your email] · 312.709.6006
1325.ai

Attachment: 1325AI_BlackRock_OnePager_v2.pdf`,
  },
  {
    id: 'bodnar',
    recipient: 'Paul Bodnar',
    title: 'Global Head of Sustainable Investing',
    to: 'paul.bodnar@blackrock.com',
    cc: 'sustainableinvesting@blackrock.com',
    subject: 'The Missing Measurement Layer for Community-Impact Capital',
    body: `Dear Mr. Bodnar,

BlackRock's sustainable investing thesis hinges on one hard problem: measuring real-world impact with auditable data. That's exactly the gap we close.

I'm the founder of 1325.AI — the agentic commerce protocol that quantifies dollar velocity, jobs supported, and community wealth created across a $1.6T underserved market segment. We don't just route capital to verified businesses; we instrument every transaction so institutional partners can prove impact in real time.

Why this matters for iShares ESG and your sustainable strategies:

- Auditable impact data — Transaction-level ledger showing where capital flows, how long it stays in-community, and what it produces (jobs, revenue, supplier relationships).
- Patent-protected infrastructure — 27 claims covering geospatial fraud detection, B2B matching, and orchestration. Defensible moat, not a dashboard.
- AI-native from day one — Autonomous agent organizations (not assistants) running operations for businesses on the network.

The ask: A 20-minute call to explore 1325.AI as a community-impact data partner for BlackRock's sustainable investing products — or a co-designed pilot in priority markets (Chicago, Atlanta, Detroit, Mobile).

I've attached our one-page brief. Would the week of [insert date] work?

With respect,

[Your Full Name]
Founder & CEO, 1325.AI
[your email] · 312.709.6006
1325.ai

Attachment: 1325AI_BlackRock_OnePager_v2.pdf`,
  },
  {
    id: 'braunstein',
    recipient: 'Lance Braunstein',
    title: 'Head of Aladdin Engineering',
    to: 'lance.braunstein@blackrock.com',
    cc: 'rob.goldstein@blackrock.com',
    subject: 'Aladdin for Community Commerce — Protocol Inquiry',
    body: `Dear Mr. Braunstein,

Aladdin is the operating system for institutional capital. We've built the equivalent for community commerce — and I think there's a conversation worth having.

I'm the founder of 1325.AI, the agentic commerce protocol powering a $1.6T underserved market. While 99% of AI companies build assistants, we built the rails autonomous AI organizations transact on: a transaction ledger, a supply chain graph, and an orchestration layer protected by 27 patent claims.

Architectural parallels to Aladdin:

- Aladdin: Risk + portfolio OS for institutions
  1325.AI: Commerce + circulation OS for community businesses

- Aladdin: Unified data model across asset classes
  1325.AI: Unified data model across consumer, B2B, and sponsorship flows

- Aladdin: API-first integration with 200+ institutions
  1325.AI: API-first agent portal for developers and partners

- Aladdin: Orchestrates capital flows
  1325.AI: Orchestrates Level 3 AI organizations (per Dan Martell's framework)

The ask: 20 minutes to share architecture, the patent claims, and where infrastructure-level partnership or technical collaboration with BlackRock could fit.

Brief attached. Open to the week of [insert date]?

With respect,

[Your Full Name]
Founder & CEO, 1325.AI
[your email] · 312.709.6006
1325.ai

Attachment: 1325AI_BlackRock_OnePager_v2.pdf`,
  },
];

const EmailCopyPage = () => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullEmail = (email: EmailTemplate) => {
    const full = `To: ${email.to}\n${email.cc ? `Cc: ${email.cc}\n` : ''}Subject: ${email.subject}\n\n${email.body}`;
    handleCopy(full, `${email.id}-full`, 'Full email');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            BlackRock Outreach Emails
          </h1>
          <p className="text-slate-600">
            Click any field to copy clean plain text — no formatting, no background colors
          </p>
        </div>

        {/* Email Cards */}
        <div className="space-y-8">
          {emails.map((email, idx) => (
            <div
              key={email.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Email #{idx + 1}
                  </div>
                  <div className="text-lg font-semibold">{email.recipient}</div>
                  <div className="text-sm text-slate-300">{email.title}</div>
                </div>
                <Button
                  onClick={() => copyFullEmail(email)}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  {copiedField === `${email.id}-full` ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Copied All
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" /> Copy Full Email
                    </>
                  )}
                </Button>
              </div>

              {/* Card Body — individual fields */}
              <div className="p-6 space-y-4">
                {/* To */}
                <FieldRow
                  label="To"
                  value={email.to}
                  copied={copiedField === `${email.id}-to`}
                  onCopy={() => handleCopy(email.to, `${email.id}-to`, 'To address')}
                />

                {/* Cc */}
                {email.cc && (
                  <FieldRow
                    label="Cc"
                    value={email.cc}
                    copied={copiedField === `${email.id}-cc`}
                    onCopy={() => handleCopy(email.cc!, `${email.id}-cc`, 'Cc address')}
                  />
                )}

                {/* Subject */}
                <FieldRow
                  label="Subject"
                  value={email.subject}
                  copied={copiedField === `${email.id}-subject`}
                  onCopy={() =>
                    handleCopy(email.subject, `${email.id}-subject`, 'Subject line')
                  }
                />

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Body
                    </label>
                    <Button
                      onClick={() =>
                        handleCopy(email.body, `${email.id}-body`, 'Email body')
                      }
                      variant="ghost"
                      size="sm"
                      className="h-8 text-slate-700 hover:text-slate-900"
                    >
                      {copiedField === `${email.id}-body` ? (
                        <>
                          <Check className="w-4 h-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" /> Copy Body
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={email.body}
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full min-h-[320px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-sans leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-10 p-6 bg-white border border-slate-200 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            💡 <strong>Tip:</strong> Use "Copy Full Email" to grab everything at once, or copy
            individual fields. All text is plain — no background, no formatting carries over.
          </p>
        </div>
      </div>
    </div>
  );
};

const FieldRow: React.FC<{
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}> = ({ label, value, copied, onCopy }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={value}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
      <Button
        onClick={onCopy}
        variant="outline"
        size="sm"
        className="shrink-0"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  </div>
);

export default EmailCopyPage;
