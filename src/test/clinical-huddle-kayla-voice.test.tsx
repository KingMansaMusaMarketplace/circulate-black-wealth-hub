// Morning huddle in Kayla's own voice: the browser sends no words (the voice service builds the
// counts-only script itself), pieces play in order, Stop silences her, and a failure never
// switches to the computer voice.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import MorningHuddle, { HUDDLE_VOICE_PROBLEM, latestHuddle } from '@/pages/health/workspace/MorningHuddle';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'token' } } }) } } }));

const AUDIO = 'https://resource2.heygen.ai/text_to_speech/huddle.mp3';
const clinic = '11111111-1111-4111-8111-111111111111';
const played: string[] = [];
const players: Array<{ onended: (() => void) | null; paused: boolean; src: string }> = [];
const spoken: string[] = [];
const fetchMock = vi.fn();
const reply = (body: object, status = 200) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  localStorage.clear(); played.length = 0; players.length = 0; spoken.length = 0; fetchMock.mockReset();
  class FakeAudio { src = ''; muted = false; paused = true; playbackRate = 1; onended: (() => void) | null = null; onerror: (() => void) | null = null;
    constructor() { players.push(this); }
    play() { if (!this.muted && this.src.startsWith('https://')) played.push(this.src); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; } }
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('fetch', fetchMock);
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak: (u: { text: string }) => spoken.push(u.text), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), getVoices: () => [] } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Morning huddle speaks in Kayla's voice", () => {
  it('sends only the clinic, huddle flag, clock offset and piece number — no words', async () => {
    fetchMock.mockResolvedValue(reply({ audio_url: AUDIO, parts: 1, text: 'Good morning. Here is your huddle.' }));
    render(<MorningHuddle clinicId={clinic} />);
    fireEvent.click(screen.getByRole('button', { name: /Play huddle/ }));
    await waitFor(() => expect(played).toEqual([AUDIO]));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/functions\/v1\/health-kayla-voice$/);
    expect(Object.keys(body).sort()).toEqual(['clinic_id', 'huddle', 'part', 'tz_offset']);
    expect(body).toMatchObject({ clinic_id: clinic, huddle: true, part: 0 });
    expect(screen.getByText('Good morning. Here is your huddle.')).toBeTruthy();
    expect(spoken).toEqual([]);
  });

  it('plays both pieces in order, and Stop silences Kayla', async () => {
    fetchMock.mockImplementation(async (_u: string, init: { body: string }) => reply({ audio_url: `${AUDIO}?part=${JSON.parse(init.body).part}`, parts: 2 }));
    render(<MorningHuddle clinicId={clinic} />);
    fireEvent.click(screen.getByRole('button', { name: /Play huddle/ }));
    await waitFor(() => expect(played).toEqual([`${AUDIO}?part=0`]));
    players[0].onended?.();
    await waitFor(() => expect(played).toEqual([`${AUDIO}?part=0`, `${AUDIO}?part=1`]));
    fireEvent.click(screen.getByRole('button', { name: /Stop/ }));
    expect(players[0].paused).toBe(true);
    expect(screen.getByRole('button', { name: /Play huddle/ })).toBeTruthy();
  });

  it('a voice failure shows a retry message instead of the computer voice', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'down' }, 502));
    render(<MorningHuddle clinicId={clinic} />);
    fireEvent.click(screen.getByRole('button', { name: /Play huddle/ }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(HUDDLE_VOICE_PROBLEM));
    expect(spoken).toEqual([]);
  });

  it('starts folded up, showing the latest update, and expands to all three huddles', () => {
    render(<MorningHuddle clinicId={clinic} />);
    expect(screen.queryByRole('group', { name: 'Choose a huddle' })).toBeNull();
    expect(screen.getByText(/Latest update:/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show all huddles' }));
    expect(screen.getByRole('group', { name: 'Choose a huddle' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hide huddles' }));
    expect(screen.queryByRole('group', { name: 'Choose a huddle' })).toBeNull();
  });
});

describe('latest huddle by clock time', () => {
  const at = (h: number, m: number) => new Date(2026, 10, 16, h, m);
  it('before noon is the Morning Kickoff', () => expect(latestHuddle(at(11, 59))).toBe('morning'));
  it('noon until 4:29 PM is the Midday Check-In', () => { expect(latestHuddle(at(12, 0))).toBe('midday'); expect(latestHuddle(at(16, 29))).toBe('midday'); });
  it('4:30 PM onward is the Afternoon Wrap-Up', () => expect(latestHuddle(at(16, 30))).toBe('afternoon'));
});
