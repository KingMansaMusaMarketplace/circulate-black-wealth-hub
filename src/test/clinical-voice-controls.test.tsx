import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClinicalVoiceGuide, { ClinicalVoiceProvider } from '@/pages/health/ClinicalVoice';

const recordings: FakeAudio[] = [];
class FakeAudio {
  src: string;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  constructor(src: string) { this.src = src; recordings.push(this); }
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); recordings.length = 0; });

describe('private clinical voice playback', () => {
  it('starts silent, supports play/pause/resume and stops on mute and private gate removal', async () => {
    vi.stubGlobal('Audio', FakeAudio);
    const view = render(<ClinicalVoiceProvider remaining={900000} extended={false} isAdmin={false}><ClinicalVoiceGuide /></ClinicalVoiceProvider>);
    expect(recordings).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Play narration' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Enable sound' }));
    expect(recordings).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Read fictional source' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Pause narration' })).toBeEnabled());
    const first = recordings[0];
    expect(first.src).toContain('.mp3');
    fireEvent.click(screen.getByRole('button', { name: 'Pause narration' }));
    expect(first.pause).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Play narration' }));
    await waitFor(() => expect(first.play).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByRole('button', { name: 'Mute narration' }));
    expect(first.src).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Enable sound' }));
    fireEvent.click(screen.getByRole('button', { name: 'Read fictional source' }));
    view.unmount();
    expect(recordings[1].pause).toHaveBeenCalled();
    expect(recordings[1].src).toBe('');
  });
  it('plays a confirmed extra-time announcement once and replaces earlier audio', async () => {
    vi.stubGlobal('Audio', FakeAudio);
    const content = (extended: boolean, remaining = 900000) => <ClinicalVoiceProvider remaining={remaining} extended={extended} isAdmin={false}><ClinicalVoiceGuide /></ClinicalVoiceProvider>;
    const view = render(content(false));
    fireEvent.click(screen.getByRole('button', { name: 'Enable sound' }));
    fireEvent.click(screen.getByRole('button', { name: 'Read fictional source' }));
    view.rerender(content(true, 1200000));
    await waitFor(() => expect(recordings).toHaveLength(2));
    expect(recordings[0].src).toBe('');
    expect(screen.getByLabelText('Written narration').textContent).toContain('Thomas has granted additional viewing time.');
    view.rerender(content(true, 1199000));
    expect(recordings).toHaveLength(2);
  });
  it('surfaces audio failure without substituting clinical advice', async () => {
    vi.stubGlobal('Audio', FakeAudio);
    render(<ClinicalVoiceProvider remaining={900000} extended={false} isAdmin><ClinicalVoiceGuide /></ClinicalVoiceProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Enable sound' }));
    fireEvent.click(screen.getByRole('button', { name: 'Read fictional source' }));
    act(() => recordings[0].onerror?.());
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Audio could not play'));
  });
});