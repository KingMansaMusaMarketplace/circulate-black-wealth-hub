import React, { useState } from 'react';
import { DirectoryPartner, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Copy, Code2, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface EmbeddableBannerGeneratorProps {
  partner: DirectoryPartner;
  stats: PartnerStats;
}

type BannerStyle = 'minimal' | 'standard' | 'detailed';
type BannerTheme = 'dark' | 'light' | 'gold';

const EmbeddableBannerGenerator: React.FC<EmbeddableBannerGeneratorProps> = ({ partner, stats }) => {
  const [style, setStyle] = useState<BannerStyle>('standard');
  const [theme, setTheme] = useState<BannerTheme>('dark');
  const [copied, setCopied] = useState(false);

  const themeStyles = {
    dark: {
      bg: '#1e293b',
      text: '#ffffff',
      accent: '#f59e0b',
      muted: '#94a3b8',
      border: '#334155',
    },
    light: {
      bg: '#ffffff',
      text: '#1e293b',
      accent: '#1B365D',
      muted: '#64748b',
      border: '#e2e8f0',
    },
    gold: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      text: '#1e293b',
      accent: '#1B365D',
      muted: '#78350f',
      border: '#b45309',
    },
  };

  const valueProposition = {
    monthlyValue: 700,
    monthlyPrice: 100,
    roi: '7x',
  };

  const generateBannerHTML = (): string => {
    const colors = themeStyles[theme];
    const bgStyle = theme === 'gold' 
      ? `background: ${colors.bg};` 
      : `background-color: ${colors.bg};`;

    if (style === 'minimal') {
      return `<!-- 1325.AI Partner Banner - Minimal -->
<a href="${partner.referral_link}" target="_blank" rel="noopener" style="
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  ${bgStyle}
  color: ${colors.text};
  text-decoration: none;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 14px;
  letter-spacing: 0.05em;
  border: 1px solid ${colors.border};
">
  <span style="font-weight: 600;">Join 1325.AI</span>
  <span style="color: ${colors.muted};">via ${partner.directory_name}</span>
</a>`;
    }

    if (style === 'standard') {
      return `<!-- 1325.AI Partner Banner - Standard -->
<div style="
  ${bgStyle}
  padding: 20px;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid ${colors.border};
  max-width: 400px;
">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <span style="font-weight: 700; font-size: 18px; color: ${colors.text}; font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">Join 1325.AI</span>
    <span style="font-size: 12px; color: ${colors.accent};">FREE until Sept 2026</span>
  </div>
  <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 12px; color: #1e293b;">
    <div style="font-weight: 800; font-size: 16px;">$${valueProposition.monthlyValue}/mo value → $${valueProposition.monthlyPrice}/mo</div>
    <div style="font-size: 11px; opacity: 0.9;">${valueProposition.roi} ROI on business tools</div>
  </div>
  <p style="margin: 0 0 16px 0; font-size: 14px; color: ${colors.muted}; line-height: 1.5;">
    The economic operating system for Black-owned businesses. Get discovered, connect B2B, and build wealth together.
  </p>
  <a href="${partner.referral_link}" target="_blank" rel="noopener" style="
    display: inline-block;
    padding: 10px 20px;
    background-color: ${theme === 'gold' ? colors.accent : colors.accent};
    color: ${theme === 'gold' ? '#ffffff' : '#ffffff'};
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
  ">
    Sign Up Free →
  </a>
  <p style="margin: 12px 0 0 0; font-size: 11px; color: ${colors.muted};">
    Referred by ${partner.directory_name}
  </p>
</div>`;
    }

    // Detailed style
    return `<!-- 1325.AI Partner Banner - Detailed -->
<div style="
  ${bgStyle}
  padding: 24px;
  border-radius: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid ${colors.border};
  max-width: 450px;
">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <span style="font-weight: 700; font-size: 20px; color: ${colors.text}; font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">Join 1325.AI</span>
    <span style="
      padding: 4px 12px;
      background: ${theme === 'gold' ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.15)'};
      border-radius: 20px;
      font-size: 12px;
      color: ${theme === 'gold' ? colors.text : colors.accent};
      font-weight: 600;
    ">Founding Member</span>
  </div>
  
  <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 16px; color: #1e293b;">
    <div style="font-weight: 800; font-size: 24px;">$${valueProposition.monthlyValue}/mo value</div>
    <div style="font-size: 16px; font-weight: 600;">for just $${valueProposition.monthlyPrice}/month</div>
    <div style="font-size: 12px; margin-top: 4px; opacity: 0.9;">${valueProposition.roi} ROI on business tools & benefits</div>
  </div>
  
  <p style="margin: 0 0 16px 0; font-size: 14px; color: ${colors.muted}; line-height: 1.6;">
    The economic operating system for Black-owned businesses.
  </p>
  
  <div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <span style="color: ${colors.accent};">✓</span>
      <span style="font-size: 13px; color: ${colors.text};">Get discovered by conscious consumers</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <span style="color: ${colors.accent};">✓</span>
      <span style="font-size: 13px; color: ${colors.text};">B2B marketplace for partnerships</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <span style="color: ${colors.accent};">✓</span>
      <span style="font-size: 13px; color: ${colors.text};">Community financing (Susu circles)</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${colors.accent};">✓</span>
      <span style="font-size: 13px; color: ${colors.text};">Track your economic impact</span>
    </div>
  </div>
  
  <a href="${partner.referral_link}" target="_blank" rel="noopener" style="
    display: block;
    text-align: center;
    padding: 12px 24px;
    background-color: ${theme === 'gold' ? colors.accent : colors.accent};
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 12px;
  ">
    Sign Up Free →
  </a>
  
  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: ${colors.muted};">
    <span>Referred by ${partner.directory_name}</span>
    <span>Free until Sept 1, 2026</span>
  </div>
</div>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateBannerHTML());
      setCopied(true);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Generate a preview using dangerouslySetInnerHTML (safe here since we control the content)
  const previewHTML = generateBannerHTML();

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Code2 className="w-5 h-5 text-amber-400" />
          Embeddable Banner
        </CardTitle>
        <CardDescription className="text-slate-400">
          HTML banners to embed on your website. Automatically tracks referrals when clicked.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-amber-400 font-semibold">Banner Style</Label>
            <Select value={style} onValueChange={(v: BannerStyle) => setStyle(v)}>
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal (Inline)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="detailed">Detailed (Full)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-amber-400 font-semibold">Color Theme</Label>
            <Select value={theme} onValueChange={(v: BannerTheme) => setTheme(v)}>
              <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="gold">Gold Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label className="text-amber-400 font-semibold">Preview</Label>
          <div className="bg-slate-900/40 rounded-lg p-6 flex items-center justify-center min-h-[200px] border border-slate-700/30">
            <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
          </div>
        </div>

        {/* Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-amber-400 font-semibold">Embed Code</Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyEmbedCode}
              className="h-7 text-xs"
            >
              {copied ? (
                <Check className="w-3 h-3 mr-1 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
          <Textarea
            readOnly
            value={generateBannerHTML()}
            className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[150px] text-xs font-mono"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={copyEmbedCode}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Embed Code'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
          <h4 className="font-medium text-amber-400 mb-2">How to Add to Your Website</h4>
          <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
            <li>Copy the embed code above</li>
            <li>Open your website editor (WordPress, Squarespace, Wix, etc.)</li>
            <li>Add an HTML or "Custom Code" block where you want the banner</li>
            <li>Paste the code and save</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbeddableBannerGenerator;
