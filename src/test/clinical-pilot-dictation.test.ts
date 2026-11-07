import { describe, expect, it } from 'vitest';
import {
  DICTATION_MAX_BYTES, DICTATION_MAX_SECONDS, DICTATION_SAMPLE_RATE, appendDictation, dictationErrorMessage, downsample, encodeWav,
} from '@/lib/clinical/dictation';

describe('pilot talk-to-type', () => {
  it('limits one recording to 2 minutes', () => {
    expect(DICTATION_MAX_SECONDS).toBe(120);
    const twoMinutes = encodeWav(new Float32Array(DICTATION_MAX_SECONDS * DICTATION_SAMPLE_RATE));
    expect(twoMinutes.length).toBeLessThanOrEqual(DICTATION_MAX_BYTES);
    const tooLong = encodeWav(new Float32Array((DICTATION_MAX_SECONDS + 5) * DICTATION_SAMPLE_RATE));
    expect(tooLong.length).toBeGreaterThan(DICTATION_MAX_BYTES);
  });

  it('adds spoken words after what the doctor already typed instead of replacing it', () => {
    expect(appendDictation('Headache for two days.', 'No fever.').text).toBe('Headache for two days. No fever.');
    expect(appendDictation('', '  Blood pressure 130 over 85 ').text).toBe('Blood pressure 130 over 85');
    expect(appendDictation('Typed note', '   ')).toEqual({ text: 'Typed note', added: false, truncated: false });
  });

  it('never goes past the 5,000-character section limit', () => {
    const r = appendDictation('a'.repeat(4995), 'more spoken words');
    expect(r.text.length).toBe(5000);
    expect(r.truncated).toBe(true);
  });

  it('records 16 kHz mono 16-bit WAV', () => {
    const wav = encodeWav(downsample([new Float32Array(48000)], 48000));
    const v = new DataView(wav.buffer);
    expect(String.fromCharCode(...wav.slice(0, 4))).toBe('RIFF');
    expect(v.getUint16(22, true)).toBe(1);
    expect(v.getUint32(24, true)).toBe(16000);
    expect(v.getUint16(34, true)).toBe(16);
    expect(v.getUint32(40, true)).toBe(16000 * 2);
  });

  it('explains common problems in plain English', () => {
    expect(dictationErrorMessage(413)).toMatch(/under 2 minutes/);
    expect(dictationErrorMessage(403)).toMatch(/pilot clinic/);
  });
});
