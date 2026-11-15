import React, { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Video, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db, type Row } from './hc';
import {
  SIGNAL_POLL_MS, VIDEO_ICE_SERVERS, VIDEO_NETWORK_TIP, VIDEO_TEST_NOTICE, connectionLabel, isJoinableRoom, pickVideoAppointment,
  planSignals, videoBlockReason, waitForIceGathering, type Signal, type VideoSide,
} from '@/lib/clinical/video-visits';

const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
type Phase = RTCPeerConnectionState | 'waiting' | 'idle';

function mediaError(e: unknown): string {
  const n = (e as { name?: string })?.name;
  if (n === 'NotAllowedError' || n === 'SecurityError') return 'Camera or microphone permission was blocked. Allow them in your browser’s address bar, then try again.';
  if (n === 'NotFoundError' || n === 'OverconstrainedError') return 'No camera or microphone was found on this device.';
  if (n === 'NotReadableError') return 'Another app is using the camera. Close it and try again.';
  return 'The camera could not start on this device.';
}

/** Live video room for one side. Video/sound travel device-to-device; only handshake notes touch the database. */
export function VideoVisitRoom({ roomId, side, onLeave }: { roomId: string; side: VideoSide; onLeave: () => void }) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const offerIdRef = useRef<number | null>(null);
  const lastIdRef = useRef(0);
  const liveRef = useRef(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [ended, setEnded] = useState(false);

  const send = useCallback(async (kind: string, payload: Record<string, unknown> | null = null) => {
    const { data: auth } = await db.auth.getUser();
    const { data, error: e } = await db.from('hc_pilot_video_signals').insert({ room_id: roomId, sender_side: side, sender_id: auth?.user?.id, kind, payload }).select('id').single();
    if (e) throw new Error(e.message);
    return Number(data?.id);
  }, [roomId, side]);

  const closePc = () => { pcRef.current?.close(); pcRef.current = null; offerIdRef.current = null; if (remoteRef.current) remoteRef.current.srcObject = null; };
  const freshPc = () => {
    closePc();
    const pc = new RTCPeerConnection({ iceServers: VIDEO_ICE_SERVERS });
    streamRef.current?.getTracks().forEach((t) => pc.addTrack(t, streamRef.current!));
    pc.ontrack = (ev) => {
      const el = remoteRef.current; if (!el) return;
      el.srcObject = ev.streams[0] ?? new MediaStream([ev.track]);
      el.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
    };
    pc.onconnectionstatechange = () => { if (pcRef.current === pc && liveRef.current) setPhase(pc.connectionState); };
    pcRef.current = pc;
    setPhase('connecting');
    return pc;
  };

  useEffect(() => {
    liveRef.current = true;
    let timer: number | undefined;
    let polls = 0;
    const run = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: { echoCancellation: true, noiseSuppression: true } });
        if (!liveRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); return; }
        if (localRef.current) localRef.current.srcObject = streamRef.current;
      } catch (e) { setError(mediaError(e)); return; }
      // Ignore handshake notes from before this device joined.
      const { data: latest } = await db.from('hc_pilot_video_signals').select('id').eq('room_id', roomId).order('id', { ascending: false }).limit(1).maybeSingle();
      lastIdRef.current = Number(latest?.id ?? 0);
      try { await send('hello'); } catch { setError('The video room could not be joined. It may have ended — go back and try again.'); return; }
      setPhase('waiting');
      const tick = async () => {
        if (!liveRef.current) return;
        polls += 1;
        try {
          if (polls % 3 === 0) {
            const { data: room } = await db.from('hc_pilot_video_rooms').select('ended_at, expires_at').eq('id', roomId).maybeSingle();
            if (!room || !isJoinableRoom(room as { ended_at: string | null; expires_at: string })) { setEnded(true); closePc(); setPhase('closed'); return; }
          }
          const { data: rows } = await db.from('hc_pilot_video_signals').select('id, sender_side, kind, payload').eq('room_id', roomId).gt('id', lastIdRef.current).order('id').limit(50);
          const batch = (rows ?? []) as Signal[];
          if (batch.length) lastIdRef.current = Math.max(...batch.map((r) => Number(r.id)));
          for (const a of planSignals(side, batch)) {
            if (!liveRef.current) return;
            if (a.do === 'peer_left') { closePc(); setPhase('waiting'); }
            else if (a.do === 'send_hello') await send('hello');
            else if (a.do === 'make_offer') {
              const pc = freshPc();
              await pc.setLocalDescription(await pc.createOffer());
              await waitForIceGathering(pc);
              if (pcRef.current !== pc) continue;
              offerIdRef.current = await send('offer', { type: 'offer', sdp: pc.localDescription?.sdp ?? '' });
            } else if (a.do === 'accept_answer') {
              const pc = pcRef.current;
              if (pc && a.ref === offerIdRef.current && pc.signalingState === 'have-local-offer') await pc.setRemoteDescription(a.answer);
            } else if (a.do === 'answer') {
              const pc = freshPc();
              await pc.setRemoteDescription(a.offer);
              await pc.setLocalDescription(await pc.createAnswer());
              await waitForIceGathering(pc);
              if (pcRef.current !== pc) continue;
              await send('answer', { type: 'answer', sdp: pc.localDescription?.sdp ?? '', ref: a.offerId });
            }
          }
        } catch { /* a missed poll is retried on the next tick */ }
        const connected = pcRef.current?.connectionState === 'connected';
        timer = window.setTimeout(() => void tick(), connected ? SIGNAL_POLL_MS.connected : SIGNAL_POLL_MS.connecting);
      };
      void tick();
    };
    void run();
    return () => {
      liveRef.current = false;
      if (timer) window.clearTimeout(timer);
      closePc();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [roomId, side]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMic = () => { const on = muted; streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = on; }); setMuted(!on); };
  const toggleCam = () => { const on = camOff; streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = on; }); setCamOff(!on); };
  const leave = async (endForAll: boolean) => {
    try { await send('bye'); } catch { /* room may already be closed */ }
    if (endForAll) {
      const { error: e } = await db.rpc('hc_pilot_video_end', { _room: roomId });
      if (e) toast.error('The video room could not be closed. It closes by itself after 2 hours.'); else toast.success('Video visit ended. Nothing was recorded.');
    }
    onLeave();
  };

  const label = ended ? 'This video visit has ended.' : connectionLabel(phase, side);
  return (
    <Card className="border-mansagold/50">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Video className="h-4 w-4 text-mansagold" />Video visit</CardTitle>
        <Badge variant={phase === 'connected' ? 'default' : phase === 'failed' ? 'destructive' : 'outline'} role="status">{label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p role="note" className="rounded-md border border-mansagold/40 bg-mansagold/10 p-2 text-xs text-muted-foreground">{VIDEO_TEST_NOTICE}</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="relative overflow-hidden rounded-lg bg-muted" style={{ aspectRatio: '16 / 9' }}>
          <video ref={remoteRef} autoPlay playsInline className="h-full w-full object-cover" aria-label={side === 'clinic' ? 'Patient video' : 'Care team video'} />
          {phase !== 'connected' && <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">{label}{phase === 'failed' && <><br />{VIDEO_NETWORK_TIP}</>}</div>}
          <video ref={localRef} autoPlay playsInline muted className="absolute bottom-3 right-3 w-1/4 min-w-[96px] rounded-md border-2 border-background object-cover shadow-lg" aria-label="Your camera" />
          {needsTap && <Button size="sm" className={`absolute left-3 top-3 ${gold}`} onClick={() => void remoteRef.current?.play().then(() => setNeedsTap(false))}><Volume2 className="mr-1 h-4 w-4" />Tap to hear sound</Button>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={toggleMic} aria-pressed={muted}>{muted ? <><MicOff className="mr-1 h-4 w-4" />Unmute</> : <><Mic className="mr-1 h-4 w-4" />Mute</>}</Button>
          <Button variant="outline" onClick={toggleCam} aria-pressed={camOff}>{camOff ? <><Camera className="mr-1 h-4 w-4" />Turn camera on</> : <><CameraOff className="mr-1 h-4 w-4" />Turn camera off</>}</Button>
          {side === 'clinic'
            ? <><Button variant="destructive" onClick={() => void leave(true)}><PhoneOff className="mr-1 h-4 w-4" />End video visit</Button>
              <Button variant="ghost" onClick={() => void leave(false)}>Leave for now</Button></>
            : <Button variant="destructive" onClick={() => void leave(false)}><PhoneOff className="mr-1 h-4 w-4" />Leave video visit</Button>}
        </div>
        <p className="text-xs text-muted-foreground">{VIDEO_NETWORK_TIP}</p>
      </CardContent>
    </Card>
  );
}

/** Lets a doctor or tester check their own camera and microphone. Nothing leaves the device. */
export function CameraTest({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  useEffect(() => {
    let stream: MediaStream | null = null; let raf = 0; let ctx: AudioContext | null = null; let live = true;
    void (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!live) { stream.getTracks().forEach((t) => t.stop()); return; }
        if (ref.current) ref.current.srcObject = stream;
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) {
          ctx = new AC(); const an = ctx.createAnalyser(); an.fftSize = 512; ctx.createMediaStreamSource(stream).connect(an);
          const buf = new Uint8Array(an.fftSize);
          const loop = () => { an.getByteTimeDomainData(buf); let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v - 128)); setLevel(Math.min(100, Math.round((peak / 128) * 160))); raf = requestAnimationFrame(loop); };
          loop();
        }
      } catch (e) { setError(mediaError(e)); }
    })();
    return () => { live = false; cancelAnimationFrame(raf); void ctx?.close(); stream?.getTracks().forEach((t) => t.stop()); };
  }, []);
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Camera className="h-4 w-4 text-mansagold" />Camera and microphone check</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : <>
          <video ref={ref} autoPlay playsInline muted className="w-full max-w-md rounded-lg bg-muted object-cover" style={{ aspectRatio: '4 / 3' }} aria-label="Your camera preview" />
          <div className="max-w-md space-y-1"><span className="text-xs text-muted-foreground">Microphone — say something and watch the bar move</span>
            <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-mansagold transition-[width] duration-75" style={{ width: `${level}%` }} /></div></div>
        </>}
        <p className="text-xs text-muted-foreground">This check stays on your device. Nothing is sent or recorded.</p>
        <Button variant="outline" onClick={onClose}>Done</Button>
      </CardContent>
    </Card>
  );
}

/** Chart card: start a video visit for this test patient's open Telehealth appointment. */
export function ChartVideoCard({ clinicId, patient, canStart }: { clinicId: string; patient: Row; canStart: boolean }) {
  const [appts, setAppts] = useState<Row[] | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    void (async () => {
      const { data } = await db.from('hc_pilot_appointments').select('id, starts_at, visit_type, status').eq('clinic_id', clinicId).eq('patient_id', patient.id)
        .eq('visit_type', 'telehealth').in('status', ['scheduled', 'checked_in']).order('starts_at').limit(20);
      if (live) setAppts(data ?? []);
    })();
    return () => { live = false; };
  }, [clinicId, patient.id]);
  if (patient.is_real) return null;
  const appt = appts ? pickVideoAppointment(appts as never[]) as Row | null : null;
  const blocked = appts ? videoBlockReason(patient, appts as never[], canStart) : null;
  const start = async () => {
    if (!appt || busy) return;
    setBusy(true);
    const { data, error } = await db.rpc('hc_pilot_video_open', { _appointment: appt.id });
    setBusy(false);
    if (error || !data) { toast.error(error?.message ?? 'The video visit could not start.'); return; }
    setTesting(false); setRoomId(String(data));
    toast.success('Video room open. The tester joins from My Chart.');
  };
  if (roomId) return <VideoVisitRoom roomId={roomId} side="clinic" onLeave={() => setRoomId(null)} />;
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Video className="h-4 w-4 text-mansagold" />Video visit (telehealth)</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setTesting(!testing)}><Camera className="mr-1 h-4 w-4" />{testing ? 'Close camera check' : 'Test my camera'}</Button>
          <Button size="sm" className={gold} disabled={!appt || !canStart || busy} onClick={() => void start()}><Video className="mr-1 h-4 w-4" />{busy ? 'Opening…' : 'Start video visit'}</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {appts === null ? <p role="status" className="text-muted-foreground">Checking for a Telehealth appointment…</p>
          : blocked ? <p className="text-muted-foreground">{blocked}</p>
          : appt && <p className="text-muted-foreground">Telehealth appointment {format(new Date(appt.starts_at), 'EEE MMM d · h:mm a')}. After you start, the tester opens My Chart on another phone or computer and taps <b className="text-foreground">Join video visit</b>.</p>}
        {testing && <CameraTest onClose={() => setTesting(false)} />}
      </CardContent>
    </Card>
  );
}

/** My Chart banner: join the video visit the care team opened. */
export function PortalVideoJoin({ patientId }: { patientId: string }) {
  const [room, setRoom] = useState<Row | null>(null);
  const [inCall, setInCall] = useState(false);
  const [testing, setTesting] = useState(false);
  useEffect(() => {
    if (inCall) return;
    let live = true;
    const check = async () => {
      const { data } = await db.from('hc_pilot_video_rooms').select('id, expires_at, ended_at, opened_at').eq('patient_id', patientId).is('ended_at', null).order('opened_at', { ascending: false }).limit(1).maybeSingle();
      if (live) setRoom(data && isJoinableRoom(data as { ended_at: string | null; expires_at: string }) ? data : null);
    };
    void check();
    const t = window.setInterval(() => void check(), 10_000);
    return () => { live = false; window.clearInterval(t); };
  }, [patientId, inCall]);
  if (inCall && room) return <VideoVisitRoom roomId={room.id} side="patient" onLeave={() => { setInCall(false); setRoom(null); }} />;
  return (
    <div className="space-y-2">
      {room ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-mansagold/50 bg-mansagold/10 p-3 text-sm">
          <span className="flex items-center gap-2"><Video className="h-4 w-4 text-mansagold" /><b>Your care team started a video visit.</b></span>
          <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setTesting(!testing)}>Test my camera</Button>
            <Button size="sm" className={gold} onClick={() => { setTesting(false); setInCall(true); }}><Video className="mr-1 h-4 w-4" />Join video visit</Button></div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Have a video appointment? A <b>Join video visit</b> button appears here when your care team starts it. <button type="button" className="underline" onClick={() => setTesting(!testing)}>{testing ? 'Close camera check' : 'Test my camera'}</button></p>
      )}
      {testing && <CameraTest onClose={() => setTesting(false)} />}
    </div>
  );
}
