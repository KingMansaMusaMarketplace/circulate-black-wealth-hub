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
  // Pin the clock to 9:00 AM so the Morning Huddle is the latest huddle whatever time the checks run.
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(2026, 10, 11, 9, 0));
  localStorage.clear(); played.length = 0; players.length = 0; spoken.length = 0; fetchMock.mockReset();
  class FakeAudio { src = ''; muted = false; paused = true; playbackRate = 1; onended: (() => void) | null = null; onerror: (() => void) | null = null;
    constructor() { players.push(this); }
    play() { if (!this.muted && this.src.startsWith('https://')) played.push(this.src); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; } }
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('fetch', fetchMock);
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak: (u: { text: string }) => spoken.push(u.text), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), getVoices: () => [] } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });

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

  it('once a huddle has played, its button offers to play it again', async () => {
    fetchMock.mockImplementation(async () => reply({ audio_url: AUDIO, parts: 1 }));
    render(<MorningHuddle clinicId={clinic} />);
    fireEvent.click(screen.getByRole('button', { name: /Play huddle/ }));
    await waitFor(() => expect(played).toEqual([AUDIO]));
    players[0].onended?.();
    fireEvent.click(await screen.findByRole('button', { name: 'Play huddle again' }));
    await waitFor(() => expect(played).toEqual([AUDIO, AUDIO]));
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

  it('starts folded up, showing the latest update, and expands to all four huddles', () => {
    render(<MorningHuddle clinicId={clinic} />);
    expect(screen.queryByRole('group', { name: 'Choose a huddle' })).toBeNull();
    expect(screen.getByText(/Latest update:/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show all huddles' }));
    const group = screen.getByRole('group', { name: 'Choose a huddle' });
    expect(group.querySelectorAll('button').length).toBe(4);
    fireEvent.click(screen.getByRole('button', { name: 'Hide huddles' }));
    expect(screen.queryByRole('group', { name: 'Choose a huddle' })).toBeNull();
  });
});

describe('latest huddle by clock time (four huddles every 24 hours)', () => {
  const at = (h: number, m: number) => new Date(2026, 10, 16, h, m);
  it('7:00 AM until 12:59 PM is the Morning Huddle', () => { expect(latestHuddle(at(7, 0))).toBe('morning'); expect(latestHuddle(at(12, 59))).toBe('morning'); });
  it('1:00 PM until 6:59 PM is the Afternoon Huddle', () => { expect(latestHuddle(at(13, 0))).toBe('afternoon'); expect(latestHuddle(at(18, 59))).toBe('afternoon'); });
  it('7:00 PM until 10:59 PM is the Evening Handoff', () => { expect(latestHuddle(at(19, 0))).toBe('evening'); expect(latestHuddle(at(22, 59))).toBe('evening'); });
  it('11:00 PM until 6:59 AM is the Night Huddle', () => { expect(latestHuddle(at(23, 0))).toBe('night'); expect(latestHuddle(at(3, 0))).toBe('night'); expect(latestHuddle(at(6, 59))).toBe('night'); });
});
