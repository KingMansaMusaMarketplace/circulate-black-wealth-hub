import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Upload, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/1325-ai-logo.png';
import poster from '@/assets/clinical-briefing-poster.jpg';
import { readPreviewPass } from './preview-credentials';
import { EndPrivateSessionButton } from './PrivateSession';

export default function ClinicalTrainingPage() {
  const video = useRef<HTMLVideoElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [admin, setAdmin] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);
  const active = useRef(true);
  const load = useCallback(async () => {
    setBusy(true); setError('');
    const { data, error: failure } = await supabase.functions.invoke('health-training-video', { body: { action: 'watch', ...readPreviewPass() } });
    if (!active.current) return;
    setBusy(false);
    if (failure || data?.error) { setError(data?.error || 'The private video could not be opened. Please retry.'); return; }
    setAdmin(data?.admin === true); setMissing(data?.available === false);
    setUrl(typeof data?.url === 'string' ? data.url : '');
  }, []);
  useEffect(() => {
    active.current = true;
    void load();
    const media = video.current;
    return () => { active.current = false; if (media) { media.pause(); media.removeAttribute('src'); media.load(); } };
  }, [load]);
  const upload = async (file?: File) => {
    if (!file) return;
    if (file.type !== 'video/mp4' || file.size > 50 * 1024 * 1024) { setError('Choose the prepared MP4 video under 50 MB.'); return; }
    setBusy(true); setError('');
    try {
      const signed = await supabase.functions.invoke('health-training-video', { body: { action: 'upload' } });
      if (signed.error || typeof signed.data?.token !== 'string') throw new Error('upload');
      const result = await supabase.storage.from('clinical-training').uploadToSignedUrl(signed.data.path, signed.data.token, file, { contentType: 'video/mp4' });
      if (result.error) throw result.error;
      if (active.current) await load();
    } catch { if (active.current) { setError('The private upload could not be completed. Please retry.'); setBusy(false); } }
  };
  return <main className="theme-clinical dark min-h-screen bg-background text-foreground px-4 py-8 md:px-8">
    <Helmet><title>{'1325 Clinical EMR / EHR — Private Doctor Orientation'}</title><meta name="description" content="Approval-only doctor orientation for 1325 Clinical EMR / EHR. Private preview · sample data only." /><meta name="robots" content="noindex,nofollow" /></Helmet>
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><Link to="/health" className="inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Clinical preview</Link><EndPrivateSessionButton /></div>
      <header className="space-y-3"><img src={logo} alt="1325.AI" className="h-16 w-16 object-contain" /><p className="text-primary font-semibold">Private preview · sample data only</p><h1 className="text-3xl md:text-4xl font-semibold">1325 Clinical EMR / EHR</h1><p className="text-xl text-muted-foreground">Doctor orientation · 9 minutes 30 seconds · captioned</p></header>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0" />Owner-approved viewing only</div>
      <video ref={video} src={url || undefined} poster={poster} controls playsInline preload="none" aria-label="Captioned Clinical doctor orientation" className="w-full aspect-video rounded-lg border border-border bg-background" onError={() => { if (url) setError('Playback stopped. Reopen the video to check your access and try again.'); }} />
      {busy && <p role="status" className="text-muted-foreground">Preparing your private video…</p>}
      {missing && !busy && <p className="text-muted-foreground">The orientation video is awaiting upload.</p>}
      {error && <div role="alert" className="space-y-3"><p className="text-destructive">{error}</p><Button variant="outline" onClick={() => void load()} disabled={busy}><RefreshCw className="mr-2 h-4 w-4" />Reopen video</Button></div>}
      {admin && <div><input ref={uploadInput} type="file" accept="video/mp4" className="hidden" aria-label="Upload private training video" onChange={e => void upload(e.target.files?.[0])} /><Button variant="outline" disabled={busy} onClick={() => uploadInput.current?.click()}><Upload className="mr-2 h-4 w-4" />{url ? 'Replace private video' : 'Upload private video'}</Button></div>}
      <footer className="space-y-3 border-t border-border pt-6 text-sm text-muted-foreground"><p>PRIVATE &amp; CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE</p><p>Kayla is an AI presenter. Records are fictional samples. This orientation does not authorize real patient data, clinical use, or live connections to another medical record system. Licensed clinicians retain every medical decision.</p><EndPrivateSessionButton /></footer>
    </div>
  </main>;
}