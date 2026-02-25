import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Share2, Copy, Calendar, CheckCircle2, Clock, Sparkles, Loader2, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

interface SocialMediaRecognitionProps {
  subscriptionId: string;
  companyName: string;
  tier: string;
  className?: string;
}

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  all: <Share2 className="h-4 w-4" />,
};

const POST_TEMPLATES = [
  "🌟 Shoutout to {company} for their continued support of Black economic empowerment! As a {tier} sponsor, they're helping circulate wealth in our communities. #SupportBlackBusiness #1325AI",
  "💪 Thank you {company} for being a {tier} corporate partner! Your investment is directly fueling Black-owned business growth. #EconomicJustice #CirculateBlackWealth",
  "🏆 We're proud to have {company} as a {tier} sponsor! Together, we're building generational wealth and closing the economic gap. #BlackWealth #1325AI",
  "✨ {company} is making a difference! As a {tier} partner, they're committed to economic equity and community empowerment. #CorporateImpact #CirculateBlackWealth",
  "🙌 Big thanks to {company}! Their {tier} sponsorship helps us connect, empower, and grow Black-owned businesses nationwide. #SupportBlackBusiness #EconomicEmpowerment",
];

export const SocialMediaRecognition: React.FC<SocialMediaRecognitionProps> = ({
  subscriptionId,
  companyName,
  tier,
  className = '',
}) => {
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['sponsor-social-posts', subscriptionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_social_posts')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('scheduled_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const generatePost = () => {
    const template = POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
    const content = template
      .replace(/{company}/g, companyName)
      .replace(/{tier}/g, tier.charAt(0).toUpperCase() + tier.slice(1));
    setNewPostContent(content);
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('sponsor_social_posts')
        .insert({
          subscription_id: subscriptionId,
          post_content: newPostContent,
          platform: selectedPlatform,
          scheduled_date: new Date().toISOString(),
          status: 'scheduled',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Social post created!');
      setNewPostContent('');
      queryClient.invalidateQueries({ queryKey: ['sponsor-social-posts', subscriptionId] });
    },
    onError: () => toast.error('Failed to create post'),
  });

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    posted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const tierFrequency: Record<string, string> = {
    bronze: 'Monthly',
    silver: 'Monthly',
    gold: 'Weekly',
    platinum: 'Daily',
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-amber-400" />
          Social Media Recognition
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          {tierFrequency[tier] || 'Monthly'} social media posts recognizing your sponsorship
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Post Generator */}
        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-amber-100">Create Recognition Post</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePost}
              className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate
            </Button>
          </div>
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Write or generate a recognition post..."
            rows={3}
            className="bg-white/5 border-white/10 text-blue-100 placeholder:text-blue-300/30 resize-none"
          />
          <div className="flex items-center gap-3">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-blue-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => createPostMutation.mutate()}
              disabled={!newPostContent.trim() || createPostMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white gap-1.5"
            >
              {createPostMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              Schedule Post
            </Button>
          </div>
        </div>

        {/* Post History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-amber-100">Recent Posts</h4>
          {isLoading ? (
            <div className="text-blue-200/50 text-sm">Loading posts...</div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-6 text-blue-200/50 text-sm">
              <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No social posts yet. Generate your first one above!
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {platformIcons[post.platform || 'all']}
                      <Badge variant="outline" className={statusColors[post.status] || ''}>
                        {post.status === 'posted' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {post.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                        {post.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-blue-300/50">
                      {format(new Date(post.scheduled_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    {post.post_content}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(post.post_content || '')}
                      className="h-7 text-xs text-blue-200/60 hover:text-blue-100 gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    {post.post_url && (
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-400 hover:text-amber-300"
                      >
                        View Post →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
