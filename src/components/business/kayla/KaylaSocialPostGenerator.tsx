import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  businessId: string;
}

export const KaylaSocialPostGenerator: React.FC<Props> = ({ businessId }) => {
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-generate-social-post', {
        body: { businessId, platform, topic: topic || undefined },
      });
      if (error) throw error;
      setPost(data?.post || data?.content || JSON.stringify(data));
      toast.success('Post generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  const copyPost = () => {
    navigator.clipboard.writeText(post);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-400" />
          Social Media Post Generator
        </h3>
        <p className="text-sm text-white/50">AI-generated posts tailored to your brand</p>
      </div>

      <Card className="bg-slate-800/40 border-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-3">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-40 bg-slate-700/50 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">📸 Instagram</SelectItem>
                <SelectItem value="facebook">📘 Facebook</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="twitter">🐦 Twitter/X</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Optional: specific topic or promotion..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-700/50 border-white/10 text-white min-h-[40px] h-10"
              rows={1}
            />
          </div>
          <Button
            onClick={generate}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? 'Generating...' : 'Generate Post'}
          </Button>
        </CardContent>
      </Card>

      {post && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="outline" className="text-xs border-white/10 text-white/50">{platform}</Badge>
              <Button size="sm" variant="ghost" onClick={copyPost} className="text-white/50">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-white/80 whitespace-pre-wrap">{post}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
