// Ask Kayla read-aloud in Kayla's own video voice: only Kayla's signed answers are sent,
// each answer is made into audio once, and the device voice takes over on any failure.
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
const fetchMock = vi.fn();
const clinic = '11111111-1111-4111-8111-111111111111';
const view = (surface: 'workspace' | 'demo' = 'workspace') => <MemoryRouter><AskKayla surface={surface} clinicId={surface === 'workspace' ? clinic : undefined} onNavigate={vi.fn()} /></MemoryRouter>;
const readButton = () => screen.getByRole('button', { name: 'Read this answer aloud' });

beforeEach(() => {
  played.length = 0; spoken.length = 0; forgetKaylaVoice(); fetchMock.mockReset();
  state.messages = [{ id: 'a1', role: 'assistant', parts: [{ type: 'text', text: 'Press Speak to dictate a note.' }, { type: 'data-receipt' }] }];
  class FakeAudio { src = ''; muted = false; paused = true; onended: (() => void) | null = null; onerror: (() => void) | null = null;
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
  it('sends only the clinic, the question choice and the signed answer, then plays Kayla’s audio', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ audio_url: AUDIO, seconds: 3 }), { status: 200 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toEqual([AUDIO]));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/functions\/v1\/health-kayla-voice$/);
    expect(Object.keys(JSON.parse(init.body)).sort()).toEqual(['clinic_id', 'receipt', 'selection']);
    expect(JSON.parse(init.body).receipt).toEqual(proof.receipt);
    expect(spoken).toEqual([]);
  });

  it('makes each answer into audio only once; replaying is free', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ audio_url: AUDIO, seconds: 3 }), { status: 200 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toHaveLength(1));
    fireEvent.click(screen.getByRole('button', { name: 'Stop spoken answer' }));
    fireEvent.click(readButton());
    await waitFor(() => expect(played).toHaveLength(2));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to the device voice when Kayla’s voice is unavailable', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'unavailable' }), { status: 502 }));
    render(view());
    fireEvent.click(readButton());
    await waitFor(() => expect(spoken).toEqual(['Press Speak to dictate a note.']));
    expect(played).toEqual([]);
  });

  it('the public demo keeps the device voice and never calls the voice service', () => {
    render(view('demo'));
    fireEvent.click(readButton());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(spoken).toEqual(['Press Speak to dictate a note.']);
  });
});
