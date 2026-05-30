// Generate VO for the 2-minute Mansa Stays "How To List" walkthrough.
// 8 segments × 15s each = 120s total, padded to exact durations.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-mansa-stays.mp3");
const TMP = "/tmp/vo-mansa-stays-segments";
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Jessica — warm, expressive, conversational
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL = "eleven_multilingual_v2";

// Each segment is timed to fit a 15-second scene with breathing room.
const segments = [
  { dur: 15,
    text: "Welcome to Mansa Stays. In the next two minutes, you'll learn how to list your property — in seven simple steps." },
  { dur: 15,
    text: "Step one. Visit mansamusamarketplace.com slash stays, and click List Your Property. Sign in — or create a free host account in seconds." },
  { dur: 15,
    text: "Step two. Start with the basics. Give your listing a title that sells the dream, pick your property type, and tell us how many guests you'll welcome." },
  { dur: 15,
    text: "Step three. Add your location. Enter your street, city, and state. Guests see only the neighborhood — your exact address stays private until they book." },
  { dur: 15,
    text: "Step four. Show what makes it special. Tap every amenity your home offers — Wi-Fi, kitchen, parking, workspace. The more you share, the more guests find you." },
  { dur: 15,
    text: "Step five. Set your price. Choose a nightly rate, a cleaning fee, and a minimum stay. Update anytime — and keep more of every booking." },
  { dur: 15,
    text: "Step six. Upload your best photos. Up to twenty images — JPG, PNG, or WEBP, under ten megabytes each. iPhone users — convert HEIC to JPG first." },
  { dur: 15,
    text: "Step seven. Review, and publish. Your listing is live. Welcome to Mansa Stays — and to a movement circulating wealth through Black-owned hospitality." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text, model_id: MODEL,
    voice_settings: { stability: 0.42, similarity_boost: 0.78, style: 0.45, use_speaker_boost: true, speed: 1.02 },
    ...(prevText ? { previous_text: prevText } : {}),
    ...(nextText ? { next_text: nextText } : {}),
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`TTS failed (${r.status}): ${await r.text()}`);
  fs.writeFileSync(outFile, Buffer.from(await r.arrayBuffer()));
}

const segFiles = [];
for (let i = 0; i < segments.length; i++) {
  const file = path.join(TMP, `seg-${String(i).padStart(2, "0")}.mp3`);
  segFiles.push({ file, dur: segments[i].dur });
  if (process.env.SKIP_EXISTING && fs.existsSync(file)) { console.log(`Seg ${i}: cached`); continue; }
  console.log(`Seg ${i} (${segments[i].dur}s): generating...`);
  await tts(segments[i].text, i > 0 ? segments[i-1].text : null, i < segments.length-1 ? segments[i+1].text : null, file);
}

const padded = [];
for (let i = 0; i < segFiles.length; i++) {
  const { file, dur } = segFiles[i];
  const p = path.join(TMP, `pad-${String(i).padStart(2, "0")}.mp3`);
  padded.push(p);
  execSync(`ffmpeg -y -i "${file}" -af "apad=whole_dur=${dur},atrim=0:${dur},asetpts=N/SR/TB" -ar 44100 -ac 2 -b:a 192k "${p}"`, { stdio: "pipe" });
}

const listFile = path.join(TMP, "concat.txt");
fs.writeFileSync(listFile, padded.map((f) => `file '${f}'`).join("\n"));
execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${OUT}"`, { stdio: "inherit" });

const total = segments.reduce((a, s) => a + s.dur, 0);
console.log(`\n✅ VO written: ${OUT} · ${total}s · ${(fs.statSync(OUT).size/1024/1024).toFixed(2)} MB`);
