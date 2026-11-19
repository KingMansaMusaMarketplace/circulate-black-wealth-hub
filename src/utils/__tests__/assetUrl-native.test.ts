import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { assetUrl } from '../assetUrl';

const CDN = '/__l5e/assets-v1/abc/meet-kayla-stream.mp4';

describe('assetUrl inside the iPhone/iPad app', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('points uploaded videos at the live site when the app runs from capacitor://', () => {
    vi.stubGlobal('location', { protocol: 'capacitor:', hostname: 'localhost' });
    expect(assetUrl(CDN)).toBe(`https://1325.ai${CDN}`);
  });

  it('leaves the website address unchanged in a normal browser', () => {
    expect(assetUrl(CDN)).toBe(CDN);
  });
});

// Every <video>/<source> fed from an uploaded file must go through assetUrl
// (directly or via TapToPlayVideo / ClinicalVideo), otherwise it shows a black box in the app.
describe('video sources use assetUrl', () => {
  const files: string[] = [];
  const walk = (d: string) => readdirSync(d).forEach((n) => {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { if (n !== '__tests__') walk(p); }
    else if (p.endsWith('.tsx')) files.push(p);
  });
  walk(join(process.cwd(), 'src'));

  it('no raw uploaded-file address is placed directly on a video tag', () => {
    const bad = files.filter((f) => /<(video|source)[^>]*\ssrc=\{\w+\.url\}/.test(readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });
});

describe('standalone video pages work inside the app', () => {
  const dir = join(process.cwd(), 'public');
  const pages = readdirSync(dir).filter((n) => n.endsWith('.html'));

  it('every page with an uploaded video rewrites its address when opened from the app', () => {
    const missing = pages.filter((n) => {
      const html = readFileSync(join(dir, n), 'utf8');
      return /["'(]\/__l5e\//.test(html) && !html.includes("'https://1325.ai'+v");
    });
    expect(missing).toEqual([]);
  });
});
