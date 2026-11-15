// Pilot video visits (telehealth). Mirrors hc_pilot_video_open / hc_pilot_video_side /
// hc_pilot_video_signals_validate: made-up test patients only, Telehealth appointments only,
// owner/doctor/nurse open a private room per appointment and only the tester linked to that
// patient's My Chart can join. Video and sound go straight between the two devices; nothing
// is recorded or stored, and the database only carries the short connection "handshake".

export const VIDEO_TEST_NOTICE =
  'Pilot video visit · made-up test patients only. Video and sound go straight between the two devices. Nothing is recorded or saved. Real patients stay locked until go-live review and a signed video-service agreement (BAA).';

export const VIDEO_NETWORK_TIP =
  'Some hotel, hospital or office Wi-Fi blocks direct video between two devices. If it won’t connect, try home Wi-Fi or a phone hotspot.';

/** Free public address-lookup (STUN) helper. It sees only device network addresses, never video or sound. */
export const VIDEO_ICE_SERVERS: RTCIceServer[] = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];

/** How often each side checks for the other side's handshake notes. */
export const SIGNAL_POLL_MS = { connecting: 1500, connected: 4000 } as const;
/** Same cap as the database: a room is open at most this long. */
export const ROOM_HOURS = 2;
export const MAX_SDP_CHARS = 20_000;

export type VideoSide = 'clinic' | 'patient';
export type SignalKind = 'hello' | 'offer' | 'answer' | 'bye';

type Appt = { id: string; visit_type: string; status: string; starts_at: string };
type Patient = { is_real?: boolean | null };

/** Why a video visit can't start for this chart, or null when it can. */
export function videoBlockReason(patient: Patient, appts: Appt[], canStart: boolean): string | null {
  if (patient.is_real) return 'Video visits are for made-up test patients only until go-live review and a signed video-service agreement.';
  if (!canStart) return 'Only the clinic owner, doctors and nurses can start a video visit.';
  if (!pickVideoAppointment(appts)) return 'Book a Telehealth appointment for this test patient first (Schedule → Book). Then come back to start the video visit.';
  return null;
}

/** The open Telehealth appointment to use: the one closest to now. */
export function pickVideoAppointment<T extends Appt>(appts: T[], now = new Date()): T | null {
  const open = appts.filter((a) => a.visit_type === 'telehealth' && (a.status === 'scheduled' || a.status === 'checked_in'));
  if (!open.length) return null;
  return [...open].sort((a, b) => Math.abs(new Date(a.starts_at).getTime() - now.getTime()) - Math.abs(new Date(b.starts_at).getTime() - now.getTime()))[0];
}

/** A room the tester can still join from My Chart. */
export function isJoinableRoom(room: { ended_at?: string | null; expires_at: string }, now = new Date()): boolean {
  return !room.ended_at && new Date(room.expires_at).getTime() > now.getTime();
}

/** Plain-language status line for the call screen. */
export function connectionLabel(state: RTCPeerConnectionState | 'waiting' | 'idle', side: VideoSide): string {
  switch (state) {
    case 'waiting': return side === 'clinic' ? 'Waiting for the patient to join from My Chart…' : 'Waiting for your care team to connect…';
    case 'new':
    case 'connecting': return 'Connecting…';
    case 'connected': return 'Connected';
    case 'disconnected': return 'Connection dropped — trying to reconnect…';
    case 'failed': return 'This network blocked the video connection.';
    case 'closed': return 'Video visit ended';
    default: return 'Getting ready…';
  }
}

/** The offer an answer replies to (signal id), or null. */
export function answerRef(payload: unknown): number | null {
  const r = (payload as { ref?: unknown } | null)?.ref;
  return typeof r === 'number' && Number.isInteger(r) && r > 0 ? r : null;
}

export type Signal = { id: number; sender_side: string; kind: string; payload: unknown };
export type SignalAction =
  | { do: 'send_hello' }
  | { do: 'make_offer' }
  | { do: 'answer'; offerId: number; offer: RTCSessionDescriptionInit }
  | { do: 'accept_answer'; ref: number; answer: RTCSessionDescriptionInit }
  | { do: 'peer_left' };

/**
 * What to do with a batch of new handshake notes. The clinic makes one offer per batch when the
 * patient says hello; the patient answers only the newest offer and says hello back only when no
 * offer followed. A goodbye counts only if nothing newer arrived after it.
 */
export function planSignals(side: VideoSide, batch: Signal[]): SignalAction[] {
  const theirs = batch.filter((s) => s.sender_side !== side).sort((a, b) => a.id - b.id);
  const last = (kind: string) => theirs.reduce((i, s, n) => (s.kind === kind ? n : i), -1);
  const hello = last('hello'); const bye = last('bye');
  if (side === 'clinic') {
    const ans = last('answer');
    if (bye > hello && bye > ans) return [{ do: 'peer_left' }];
    const out: SignalAction[] = [];
    if (hello >= 0) out.push({ do: 'make_offer' });
    if (ans > hello) {
      const s = theirs[ans]; const d = parseDescription(s.payload, 'answer'); const ref = answerRef(s.payload);
      if (d && ref) out.push({ do: 'accept_answer', ref, answer: d });
    }
    return out;
  }
  const off = last('offer');
  if (bye > hello && bye > off) return [{ do: 'peer_left' }];
  const out: SignalAction[] = [];
  if (hello > off) out.push({ do: 'send_hello' });
  if (off >= 0 && off > bye) {
    const s = theirs[off]; const d = parseDescription(s.payload, 'offer');
    if (d) out.push({ do: 'answer', offerId: s.id, offer: d });
  }
  return out;
}

/** Only well-formed offer/answer descriptions are accepted from the other side. */
export function parseDescription(payload: unknown, expected: 'offer' | 'answer'): RTCSessionDescriptionInit | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as { type?: unknown; sdp?: unknown };
  if (p.type !== expected || typeof p.sdp !== 'string' || p.sdp.length === 0 || p.sdp.length > MAX_SDP_CHARS) return null;
  return { type: expected, sdp: p.sdp };
}

/** Wait until the device has gathered its network routes (or give up after `ms`), so one note carries everything. */
export function waitForIceGathering(pc: RTCPeerConnection, ms = 3000): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => { pc.removeEventListener('icegatheringstatechange', check); window.clearTimeout(t); resolve(); };
    const check = () => { if (pc.iceGatheringState === 'complete') done(); };
    const t = window.setTimeout(done, ms);
    pc.addEventListener('icegatheringstatechange', check);
  });
}
