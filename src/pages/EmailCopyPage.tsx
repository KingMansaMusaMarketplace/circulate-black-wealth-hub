import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Mail, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full p-6 shadow-2xl animate-pulse border-4 border-white/30">
              <Mail className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            Email Reply to Anton
          </h1>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Your submission email ready to send ✨
          </p>
        </div>

        {/* Copy Button */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={handleCopy} 
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-xl px-12 py-8 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:scale-110 transition-all border-4 border-white/30 font-bold gap-3"
          >
            {copied ? (
              <>
                <Check className="w-7 h-7 animate-pulse" />
                ✅ Copied!
              </>
            ) : (
              <>
                <Copy className="w-7 h-7" />
                📋 Copy to Clipboard
              </>
            )}
          </Button>
        </div>
        
        {/* Email Content Card */}
        <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30 border-0 shadow-2xl rounded-2xl p-10 hover:shadow-[0_0_60px_rgba(168,85,247,0.4)] transition-all group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Email Content
              </span>
            </div>
            
            <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 text-lg leading-relaxed p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl border-2 border-purple-200/50 shadow-inner">
              {emailText}
            </pre>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            💡 Click the "Copy to Clipboard" button above or select all the text and copy it manually
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCopyPage;
