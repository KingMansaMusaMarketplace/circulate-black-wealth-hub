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
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div className="flex justify-center p-6 bg-muted/50 rounded-lg border">
          <div className="w-[300px] bg-background rounded-lg shadow-lg border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Powered by</p>
                <p className="text-sm font-semibold">1325.ai</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded p-3 text-center">
                <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{stats.totalReferrals}</p>
                <p className="text-xs text-muted-foreground">Businesses Referred</p>
              </div>
              <div className="bg-muted/50 rounded p-3 text-center">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <p className="text-lg font-bold">{stats.conversionRate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              {partnerName} is a verified 1325.ai Partner
            </p>
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Embed Code</h4>
          <Button variant="outline" size="sm" onClick={copyEmbedCode}>
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
          className="font-mono text-xs h-20"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Add this code to your website to display your partnership stats.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">How to add to your site</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Copy the embed code above</li>
          <li>Paste it into your website's HTML where you want the widget to appear</li>
          <li>The widget will automatically update with your latest stats</li>
        </ol>
      </div>
    </div>
  );
};

export default PartnerEmbedWidget;
