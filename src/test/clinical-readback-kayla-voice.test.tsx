// Prescription and lab read-backs: Kayla's own voice for made-up test patients (the service builds the
// words from checked order fields), the device voice for real patients or when the service says so.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReadBackButton, READBACK_VOICE_PROBLEM } from '@/pages/health/workspace/PilotOrders';
import { RX_ROUTES } from '@/lib/clinical/prescriptions';
import { LAB_PRIORITY_LABELS } from '@/lib/clinical/lab-orders';
import { READBACK_PRIORITY_LABELS, READBACK_ROUTES } from '../../supabase/functions/_shared/clinical-readback';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'token' } } }) } } }));

const AUDIO = 'https://resource2.heygen.ai/text_to_speech/readback.mp3';
const clinic = '11111111-1111-4111-8111-111111111111';
const patient = '22222222-2222-4222-8222-222222222222';
const played: string[] = [];
const spoken: string[] = [];
const fetchMock = vi.fn();
const reply = (body: object, status = 200) => new Response(JSON.stringify(body), { status });
const order = () => ({ readback: 'lab' as const, order: { test_name: 'CBC', priority: 'stat', reason: 'Fever' } });
const view = (real = false) => render(<ReadBackButton clinicId={clinic} patientId={patient} real={real} order={order} text={() => 'device words'} />);

beforeEach(() => {
  played.length = 0; spoken.length = 0; fetchMock.mockReset();
  class FakeAudio { src = ''; muted = false; paused = true; onended: (() => void) | null = null; onerror: (() => void) | null = null;
    play() { if (!this.muted && this.src.startsWith('https://')) played.push(this.src); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; } }
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('fetch', fetchMock);
  class Utterance { text: string; lang = ''; rate = 1; voice: unknown = null; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(t: string) { this.text = t; } }
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak: (u: Utterance) => spoken.push(u.text), cancel: vi.fn(), getVoices: () => [] } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Kayla read-back voice', () => {
  it('the voice service uses the same routes and priority labels as the order forms', () => {
    expect([...READBACK_ROUTES]).toEqual([...RX_ROUTES]);
    expect(READBACK_PRIORITY_LABELS).toEqual(LAB_PRIORITY_LABELS);
  });

  it('test patient: sends only the order fields and plays Kayla’s voice', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, parts: 1 }));
    view();
    fireEvent.click(screen.getByRole('button', { name: /Kayla read-back/ }));
    await waitFor(() => expect(played).toEqual([AUDIO]));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(Object.keys(body).sort()).toEqual(['clinic_id', 'order', 'part', 'patient_id', 'readback']);
    expect(body.order).toEqual({ test_name: 'CBC', priority: 'stat', reason: 'Fever' });
    expect(spoken).toEqual([]);
  });

  it('real patient: uses the device voice and sends nothing', () => {
    view(true);
    fireEvent.click(screen.getByRole('button', { name: /Kayla read-back/ }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(spoken).toEqual(['device words']);
  });

  it('when the service says device only (clinic cleared for real patients), the device voice reads it', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'x', device_only: true }, 403));
    view();
    fireEvent.click(screen.getByRole('button', { name: /Kayla read-back/ }));
    await waitFor(() => expect(spoken).toEqual(['device words']));
    expect(played).toEqual([]);
  });

  it('a voice failure shows a retry message, not the computer voice', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'down' }, 502));
    view();
    fireEvent.click(screen.getByRole('button', { name: /Kayla read-back/ }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(READBACK_VOICE_PROBLEM));
    expect(spoken).toEqual([]);
  });
});
