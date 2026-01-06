import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { Download, Share2, Copy, QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReferrals } from '@/hooks/use-referrals';
import { ShareButton } from '@/components/social-share/ShareButton';

interface QRCodeReferralProps {
  compact?: boolean;
}

export const QRCodeReferral: React.FC<QRCodeReferralProps> = ({ compact = false }) => {
  const { getReferralLink, referralCode } = useReferrals();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  const referralLink = getReferralLink();

  useEffect(() => {
    if (!referralLink) return;

    const generateQR = async () => {
      try {
        setIsGenerating(true);
        const url = await QRCode.toDataURL(referralLink, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1B365D',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [referralLink]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `mansa-referral-${referralCode}.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast.success('QR code downloaded!');
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied!');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
        {qrCodeUrl && (
          <img 
            src={qrCodeUrl} 
            alt="Referral QR Code" 
            className="w-16 h-16 rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-blue-200">Your referral code</p>
          <p className="font-mono font-bold text-white text-lg">{referralCode}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyCode}
          className="border-white/20 text-blue-200"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-white">Your QR Code</span>
        </div>
        <p className="text-blue-200 text-sm mt-1">
          Perfect for in-person sharing at events!
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {isGenerating ? (
              <div className="w-48 h-48 bg-white/10 rounded-2xl animate-pulse flex items-center justify-center">
                <QrCode className="w-12 h-12 text-blue-200 animate-pulse" />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={qrCodeUrl} 
                  alt="Referral QR Code" 
                  className="w-48 h-48 rounded-2xl shadow-xl"
                />
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-purple-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Referral Code */}
        <div className="text-center">
          <p className="text-sm text-blue-200 mb-2">Your unique referral code</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
            <span className="font-mono font-bold text-xl text-white tracking-wider">
              {referralCode}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyCode}
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownload}
            disabled={!qrCodeUrl}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR
          </Button>
          <ShareButton
            data={{
              title: 'Join Mansa Musa Marketplace!',
              text: `Use my referral code ${referralCode} to join!`,
              url: referralLink,
            }}
            variant="outline"
            showLabel
          />
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
          <Smartphone className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300">Pro Tip</p>
            <p className="text-xs text-blue-200">
              Show this QR code at networking events, conferences, or meetups. 
              When someone scans it, they'll be taken directly to sign up with your referral!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
