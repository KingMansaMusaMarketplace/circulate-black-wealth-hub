// Ask Kayla read-aloud in Kayla's own video voice: only Kayla's signed answers are sent, answers are
// spoken piece by piece, each piece is made into audio once, a failure never switches to a computer
// voice in the clinic workspace, and the Stop Kayla button silences her.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AskKayla from '@/pages/health/AskKayla';
import { forgetKaylaVoice } from '@/pages/health/kayla-voice';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'token' } } }) } } }));
vi.mock('@/pages/health/workspace/DictationButton', () => ({ default: () => null }));
type Msg = { id: string; role: 'user' | 'assistant'; parts: Array<{ type: string; text?: string }> };
const proof = { selection: { topics: ['notes'], intent: 'explain' }, receipt: { text: 'Press Speak to dictate a note.', proof: 'a'.repeat(64) } };
const state: { messages: Msg[]; status: string } = { messages: [], status: 'ready' };
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ useClinicalHelpConversation: () => ({ ...state, problem: '', ask: vi.fn(), clear: vi.fn(), previousTopics: () => [], voiceProof: (id: string) => id === 'a1' ? proof : null }) }));

const AUDIO = 'https://resource2.heygen.ai/text_to_speech/kayla.mp3';
const played: string[] = [];
const spoken: string[] = [];
const players: Array<{ onended: (() => void) | null; paused: boolean }> = [];
const fetchMock = vi.fn();
const clinic = '11111111-1111-4111-8111-111111111111';
const view = (surface: 'workspace' | 'demo' = 'workspace') => <MemoryRouter><AskKayla surface={surface} clinicId={surface === 'workspace' ? clinic : undefined} onNavigate={vi.fn()} /></MemoryRouter>;
const readButton = () => screen.getByRole('button', { name: /Read aloud|Repeat answer/ });
const reply = (body: object, status = 200) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  played.length = 0; spoken.length = 0; players.length = 0; forgetKaylaVoice(); fetchMock.mockReset();
  state.messages = [{ id: 'a1', role: 'assistant', parts: [{ type: 'text', text: 'Press Speak to dictate a note.' }, { type: 'data-receipt' }] }];
  class FakeAudio { src = ''; muted = false; paused = true; onended: (() => void) | null = null; onerror: (() => void) | null = null;
    constructor() { players.push(this); }
    play() { if (!this.muted && this.src.startsWith('https://')) played.push(this.src); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; } }
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('fetch', fetchMock);
  class Utterance { text: string; volume = 1; lang = ''; voice: unknown = null; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(t: string) { this.text = t; } }
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak: (u: Utterance) => { if (u.volume > 0) spoken.push(u.text); }, cancel: vi.fn(), getVoices: () => [] } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Ask Kayla speaks in Kayla's video voice", () => {
  it('sends only the clinic, the question choice, the signed answer and a piece number, then plays Kayla’s audio', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, seconds: 3, parts: 1 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toEqual([AUDIO]));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/functions\/v1\/health-kayla-voice$/);
    expect(Object.keys(JSON.parse(init.body)).sort()).toEqual(['clinic_id', 'part', 'receipt', 'selection']);
    expect(JSON.parse(init.body).receipt).toEqual(proof.receipt);
    expect(JSON.parse(init.body).part).toBe(0);
    expect(spoken).toEqual([]);
  });

  it('plays a long answer piece by piece, in order, all in Kayla’s voice', async () => {
    fetchMock.mockImplementation(async (_url: string, init: { body: string }) => {
      const part = JSON.parse(init.body).part;
      return reply({ audio_url: `${AUDIO}?part=${part}`, parts: 3 });
    });
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toEqual([`${AUDIO}?part=0`]));
    players[0].onended?.();
    await waitFor(() => expect(played).toEqual([`${AUDIO}?part=0`, `${AUDIO}?part=1`]));
    players[0].onended?.();
    await waitFor(() => expect(played).toEqual([`${AUDIO}?part=0`, `${AUDIO}?part=1`, `${AUDIO}?part=2`]));
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(spoken).toEqual([]);
  });

  it('makes each answer into audio only once; replaying is free', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, seconds: 3, parts: 1 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toHaveLength(1));
    fireEvent.click(screen.getByRole('button', { name: 'Stop reading' }));
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toHaveLength(2));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never switches to a computer voice in the clinic workspace when Kayla’s voice fails', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'unavailable' }, 502));
    render(view());
    fireEvent.click(readButton());
    expect(await screen.findByRole('alert')).toHaveTextContent("Kayla's voice couldn't start");
    expect(spoken).toEqual([]);
    expect(played).toEqual([]);
  });

  it('after Kayla reads an answer once, a Repeat answer button plays it again from the start', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, parts: 1 }));
    render(view());
    expect(screen.getByRole('button', { name: 'Read aloud' })).toBeTruthy();
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toEqual([AUDIO]));
    players[0].onended?.();
    const repeat = await screen.findByRole('button', { name: 'Repeat answer' });
    fireEvent.click(repeat);
    await waitFor(() => expect(played).toEqual([AUDIO, AUDIO]));
  });

  it('shows the voice service’s own short reason when it refuses', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'Your approved viewing is not active on this device.' }, 403));
    render(view());
    fireEvent.click(readButton());
    expect(await screen.findByRole('alert')).toHaveTextContent("Kayla's voice couldn't start: Your approved viewing is not active on this device.");
  });

  it('the Stop Kayla button silences her right away', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, parts: 1 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toEqual([AUDIO]));
    fireEvent.click(screen.getByRole('button', { name: /Stop Kayla/ }));
    expect(players[0].paused).toBe(true);
    expect(screen.queryByRole('button', { name: /Stop Kayla/ })).toBeNull();
  });

  it('the public demo keeps the device voice and never calls the voice service', () => {
    render(view('demo'));
    fireEvent.click(readButton());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(spoken).toEqual(['Press Speak to dictate a note.']);
  });
});
