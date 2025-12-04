import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Wand2, Copy, Send, Loader2, RefreshCw } from 'lucide-react';

const AIAnnouncementWriter: React.FC = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const generateAnnouncement = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'draft_announcement',
          data: {
            type: announcementType,
            topic,
            audience: targetAudience,
            keyPoints,
          },
        },
      });

      if (error) throw error;

      const result = data.result;
      
      // Try to extract title and message
      const titleMatch = result.match(/(?:title|subject|headline):\s*(.+?)(?:\n|$)/i);
      const messageMatch = result.match(/(?:message|body|content):\s*([\s\S]+?)(?:$)/i);

      if (titleMatch && messageMatch) {
        setGeneratedTitle(titleMatch[1].trim().replace(/^["']|["']$/g, ''));
        setGeneratedMessage(messageMatch[1].trim().replace(/^["']|["']$/g, ''));
      } else {
        // If can't parse, split by first line
        const lines = result.split('\n').filter((l: string) => l.trim());
        setGeneratedTitle(lines[0]?.replace(/^#*\s*/, '').trim() || 'Announcement');
        setGeneratedMessage(lines.slice(1).join('\n').trim() || result);
      }

      toast.success('Announcement generated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate announcement');
    } finally {
      setLoading(false);
    }
  };

  const publishAnnouncement = async () => {
    if (!generatedTitle || !generatedMessage) {
      toast.error('Please generate an announcement first');
      return;
    }

    setPublishing(true);
    try {
      const { error } = await supabase
        .from('broadcast_announcements')
        .insert({
          title: generatedTitle,
          message: generatedMessage,
          announcement_type: announcementType,
          target_audience: targetAudience,
          created_by: user?.id,
          is_active: true,
        });

      if (error) throw error;

      toast.success('Announcement published!');
      setGeneratedTitle('');
      setGeneratedMessage('');
      setTopic('');
      setKeyPoints('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to publish announcement');
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${generatedTitle}\n\n${generatedMessage}`);
    toast.success('Copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          AI Announcement Writer
        </CardTitle>
        <CardDescription>
          Generate professional announcements with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Subject</label>
              <Input
                placeholder="e.g., New feature launch, Scheduled maintenance..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={announcementType} onValueChange={setAnnouncementType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Audience</label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="businesses">Businesses</SelectItem>
                    <SelectItem value="agents">Sales Agents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Key Points (optional)</label>
              <Textarea
                placeholder="Enter key points to include..."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={generateAnnouncement} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Announcement
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Title</label>
              <Input
                placeholder="Title will appear here..."
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Message</label>
              <Textarea
                placeholder="Message will appear here..."
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateAnnouncement}
                disabled={loading || !topic}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!generatedMessage}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={publishAnnouncement}
                disabled={publishing || !generatedMessage}
                className="flex-1"
              >
                {publishing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnnouncementWriter;
