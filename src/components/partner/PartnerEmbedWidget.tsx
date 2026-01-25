import React, { useState } from 'react';
import { PartnerStats } from '@/types/partner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Users, TrendingUp } from 'lucide-react';

interface PartnerEmbedWidgetProps {
  embedCode: string;
  stats: PartnerStats;
  partnerName: string;
}

const PartnerEmbedWidget: React.FC<PartnerEmbedWidgetProps> = ({ embedCode, stats, partnerName }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Embed code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-amber-400">Preview</h4>
        <div className="flex justify-center p-6 bg-slate-800/50 rounded-lg border border-amber-500/20">
          <div className="w-[300px] bg-slate-900 rounded-lg shadow-lg border border-amber-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-amber-300/70">Powered by</p>
                <p className="text-sm font-mono font-semibold tracking-wider text-amber-100">1325.AI</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/70 rounded p-3 text-center border border-amber-500/10">
                <Users className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <p className="text-lg font-bold text-amber-100">{stats.totalReferrals}</p>
                <p className="text-xs text-amber-300/70">Businesses Referred</p>
              </div>
              <div className="bg-slate-800/70 rounded p-3 text-center border border-amber-500/10">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-400" />
                <p className="text-lg font-bold text-amber-100">{stats.conversionRate.toFixed(0)}%</p>
                <p className="text-xs text-amber-300/70">Conversion Rate</p>
              </div>
            </div>
            <p className="text-xs text-center text-amber-200/80 mt-3">
              {partnerName} is a verified <span className="font-mono tracking-wider">1325.AI</span> Partner
            </p>
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-amber-400">Embed Code</h4>
          <Button variant="outline" size="sm" onClick={copyEmbedCode} className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        <Textarea 
          value={embedCode}
          readOnly
          className="font-mono text-xs h-20 bg-slate-800/50 border-amber-500/30 text-amber-100"
        />
        <p className="text-xs text-amber-300/70 mt-2">
          Add this code to your website to display your partnership stats.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20">
        <h4 className="text-sm font-semibold mb-2 text-amber-400">How to add to your site</h4>
        <ol className="text-sm text-amber-200/80 space-y-1 list-decimal list-inside">
          <li>Copy the embed code above</li>
          <li>Paste it into your website's HTML where you want the widget to appear</li>
          <li>The widget will automatically update with your latest stats</li>
        </ol>
      </div>
    </div>
  );
};

export default PartnerEmbedWidget;
