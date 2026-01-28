import React, { useState } from 'react';
import { DirectoryPartner } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Trophy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SuccessStoryTemplateProps {
  partner: DirectoryPartner;
}

const SuccessStoryTemplate: React.FC<SuccessStoryTemplateProps> = ({ partner }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    achievement: '',
    metric: '',
    quote: '',
  });

  const generateStory = () => {
    const { businessName, ownerName, achievement, metric, quote } = formData;
    
    return `🏆 SUCCESS STORY: ${businessName || '[Business Name]'}

${ownerName || '[Owner Name]'} joined 1325.AI through ${partner.directory_name} and the results speak for themselves.

📈 THE WIN:
${achievement || '[Describe what they achieved - e.g., "Connected with 3 new B2B suppliers, reducing costs by 20%"]'}

💰 BY THE NUMBERS:
${metric || '[Add a specific metric - e.g., "$5,000 saved in first quarter" or "15 new customers from directory listing"]'}

💬 IN THEIR WORDS:
"${quote || '[Add a quote from the business owner about their experience]'}"

---

Ready to write your own success story?

🔗 Join 1325.AI FREE: ${partner.referral_link}
📱 Partner Code: ${partner.referral_code}

$700/month in business tools for just $100/month = 7x ROI
Founding Member status closes Sept 1, 2026 or at 100K members — whichever comes first!

#BlackOwnedBusiness #1325AI #SuccessStory #BuyBlack`;
  };

  const copyStory = async () => {
    try {
      await navigator.clipboard.writeText(generateStory());
      setCopied(true);
      toast.success('Success story copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const isFormEmpty = !formData.businessName && !formData.ownerName && !formData.achievement && !formData.metric && !formData.quote;

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Trophy className="w-5 h-5 text-amber-400" />
          Success Story Template
        </CardTitle>
        <CardDescription className="text-slate-400">
          Fill in the details to create a shareable success story. Great for social proof!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-amber-400 font-semibold">Business Name</Label>
              <Input
                placeholder="e.g., Soul Food Kitchen"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="bg-slate-900/60 border-slate-700 text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-amber-400 font-semibold">Owner Name</Label>
              <Input
                placeholder="e.g., Marcus Johnson"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="bg-slate-900/60 border-slate-700 text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-amber-400 font-semibold">What did they achieve?</Label>
            <Textarea
              placeholder="e.g., Connected with 3 new B2B suppliers through the marketplace, reducing ingredient costs by 20%"
              value={formData.achievement}
              onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-amber-400 font-semibold">Key Metric or Result</Label>
            <Input
              placeholder="e.g., $5,000 saved in first quarter"
              value={formData.metric}
              onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
              className="bg-slate-900/60 border-slate-700 text-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-amber-400 font-semibold">Quote from Owner (optional)</Label>
            <Textarea
              placeholder="e.g., 1325.AI connected me with suppliers I never would have found on my own. This platform is a game-changer for our community."
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[80px]"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <Label className="text-amber-400 font-semibold">Preview</Label>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap border border-slate-700">
            {generateStory()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={copyStory}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Success Story'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFormData({ businessName: '', ownerName: '', achievement: '', metric: '', quote: '' })}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Clear
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
          <h4 className="font-medium text-amber-400 mb-2">📝 Tips for Great Success Stories</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• <strong>Be specific:</strong> Numbers and percentages are more compelling than vague claims</li>
            <li>• <strong>Get permission:</strong> Always ask the business owner before sharing their story</li>
            <li>• <strong>Add photos:</strong> Include a photo of the business or owner when posting</li>
            <li>• <strong>Tag them:</strong> Tag the featured business to increase reach</li>
            <li>• <strong>Follow up:</strong> Check back in 3-6 months for updated results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStoryTemplate;
