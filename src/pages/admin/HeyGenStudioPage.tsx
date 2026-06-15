import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Download, Copy, Video as VideoIcon, ExternalLink } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'processing' | 'completed' | 'failed';

const HeyGenStudioPage: React.FC = () => {
  const [title, setTitle] = useState('1325.AI — The Blueprint');
  const [avatarId, setAvatarId] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [script, setScript] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
  }, []);

  const startPolling = (id: string) => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(async () => {
      const { data, error } = await supabase.functions.invoke('heygen-video-status', {
        body: { video_id: id },
      });
      if (error) {
        console.error(error);
        return;
      }
      if (data?.status === 'completed') {
        setStatus('completed');
        setVideoUrl(data.video_url ?? null);
        setThumbnail(data.thumbnail_url ?? null);
        if (pollRef.current) window.clearInterval(pollRef.current);
        toast.success('Video ready');
      } else if (data?.status === 'failed') {
        setStatus('failed');
        setErrMsg(data?.error?.message || data?.error || 'HeyGen reported failure');
        if (pollRef.current) window.clearInterval(pollRef.current);
        toast.error('Video generation failed');
      }
    }, 8000);
  };

  const handleGenerate = async () => {
    setErrMsg(null);
    setVideoUrl(null);
    setThumbnail(null);
    setVideoId(null);

    if (!script.trim() || !avatarId.trim() || !voiceId.trim()) {
      toast.error('Script, Avatar ID and Voice ID are required');
      return;
    }
    if (script.length > 1500) {
      toast.error('Script must be 1500 characters or less');
      return;
    }

    setStatus('submitting');
    const { data, error } = await supabase.functions.invoke('heygen-generate-video', {
      body: { title, script, avatar_id: avatarId, voice_id: voiceId },
    });

    if (error || !data?.video_id) {
      console.error('generate error', error, data);
      setStatus('failed');
      setErrMsg(data?.error || error?.message || 'Failed to start generation');
      toast.error('Could not start video generation');
      return;
    }

    setVideoId(data.video_id);
    setStatus('processing');
    toast.success('Generation started — polling every 8 seconds');
    startPolling(data.video_id);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <Helmet>
        <title>HeyGen Studio — 1325.AI Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-[#FFB300]">
            <VideoIcon className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Admin · HeyGen Studio</span>
          </div>
          <h1 className="text-3xl font-semibold">Generate a 1325.AI Spokesperson Video</h1>
          <p className="text-white/60 text-sm">
            Paste a script, an Avatar ID and a Voice ID from your HeyGen account. The video is
            generated server-side using your HeyGen API key. History is not saved — copy or
            download the link before leaving this page.
          </p>
        </header>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Video inputs</CardTitle>
            <CardDescription className="text-white/60">
              Find IDs in HeyGen → Avatars / Voices → copy ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white/80">Title (your reference)</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/40 border-white/20 text-white" />
              </div>
              <div />
              <div>
                <Label htmlFor="avatar" className="text-white/80">Avatar ID</Label>
                <Input id="avatar" value={avatarId} onChange={(e) => setAvatarId(e.target.value)}
                  placeholder="e.g. Daisy-inskirt-20220818"
                  className="bg-black/40 border-white/20 text-white" />
              </div>
              <div>
                <Label htmlFor="voice" className="text-white/80">Voice ID</Label>
                <Input id="voice" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}
                  placeholder="e.g. 131a436204..."
                  className="bg-black/40 border-white/20 text-white" />
              </div>
            </div>

            <div>
              <Label htmlFor="script" className="text-white/80">
                Script ({script.length}/1500)
              </Label>
              <Textarea id="script" rows={8} value={script} onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your spokesperson script here..."
                className="bg-black/40 border-white/20 text-white" />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={status === 'submitting' || status === 'processing'}
              className="bg-[#FFB300] text-black hover:bg-[#FFB300]/90"
            >
              {(status === 'submitting' || status === 'processing') && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {status === 'processing' ? 'Generating…' : 'Generate Video'}
            </Button>
          </CardContent>
        </Card>

        {videoId && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center justify-between">
                <span>Job status: <span className="text-[#FFB300]">{status}</span></span>
                <button onClick={() => copy(videoId)} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                  <Copy className="w-3 h-3" /> {videoId}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === 'processing' && (
                <p className="text-sm text-white/70">
                  HeyGen typically takes 30–90 seconds. We'll auto-refresh every 8s.
                </p>
              )}
              {errMsg && <p className="text-sm text-red-400">{errMsg}</p>}
              {status === 'completed' && videoUrl && (
                <div className="space-y-3">
                  <video
                    src={videoUrl}
                    poster={thumbnail ?? undefined}
                    controls
                    className="w-full rounded-lg border border-white/10"
                  />
                  <div className="flex flex-wrap gap-2">
                    <a href={videoUrl} download target="_blank" rel="noreferrer">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" /> Download MP4
                      </Button>
                    </a>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => copy(videoUrl)}>
                      <Copy className="w-4 h-4 mr-2" /> Copy link
                    </Button>
                    <a href={videoUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <ExternalLink className="w-4 h-4 mr-2" /> Open
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-white/50">
                    HeyGen-hosted URLs expire. Download a local copy if you need to keep it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HeyGenStudioPage;
