import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmailCopyPage = () => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const emailText = `Subject: Re: Exclusive Invitation to Lovable App Marketplace - Application Submitted

Dear Anton,

Thank you for this incredible honor and opportunity. Being recognized as one of your most active users and selected for the first wave of the Lovable app marketplace is truly humbling.

I'm building Mansa Musa Marketplace - a mission-driven platform focused on circulating Black wealth and empowering Black-owned businesses through technology. The platform combines loyalty programs, business discovery, corporate sponsorships, and economic impact tracking to create lasting community wealth.

I've just submitted my application and would be deeply honored to showcase this work to the Lovable community. Your platform has been instrumental in bringing this vision to life, and the opportunity to reach millions of builders is both exciting and meaningful.

Thank you for believing in what we're building and for creating such an empowering platform for developers and entrepreneurs.

With gratitude and respect,

[Your Name]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Email text copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Email Reply to Anton</h1>
          <Button onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
        
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
          <pre className="whitespace-pre-wrap font-sans text-black text-base leading-relaxed">
            {emailText}
          </pre>
        </div>

        <p className="mt-4 text-gray-600 text-sm">
          Click the "Copy to Clipboard" button above or select all the text and copy it manually.
        </p>
      </div>
    </div>
  );
};

export default EmailCopyPage;
