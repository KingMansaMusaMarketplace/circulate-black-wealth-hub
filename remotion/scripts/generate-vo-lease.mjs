// VO for 2-minute Mansa Stays "How To List Your Property for Yearly Leases".
// 8 segments × 15s = 120s total.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-lease.mp3");
const TMP = "/tmp/vo-lease-segments";
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

const VOICE_ID = "cgSgspJ2msm6clMCkdW9"; // Jessica
const MODEL = "eleven_multilingual_v2";

const segments = [
  { dur: 15, text: "Welcome to Mansa Stays. In the next two minutes, you'll learn how to list your property for a yearly lease — in seven simple steps." },
  { dur: 15, text: "Step one. Visit mansamusamarketplace.com slash stays, then open Host, Create Lease. Sign in — or create a free landlord account in seconds." },
  { dur: 15, text: "Step two. Upload your best photos. JPG, PNG or WEBP, under ten megabytes each. iPhone hosts — convert HEIC to JPG first. Bright daylight rents faster." },
  { dur: 15, text: "Step three. Tell renters about it. Write a title that sells the dream, pick a property type, and add a short description that paints the picture." },
  { dur: 15, text: "Step four. Add your address. Renters see only the neighborhood — your exact address stays private until you accept their application." },
  { dur: 15, text: "Step five. Set the specs. Bedrooms, bathrooms, maximum occupants — and the date you're ready for move-in. Note any utilities you include." },
  { dur: 15, text: "Step six. Set your rent. Choose a monthly rent, security deposit, and lease term — usually twelve months. Update anytime before a tenant applies." },
  { dur: 15, text: "Step seven. Set your screening, acknowledge fair housing, and publish. Free to list — you only pay ninety-nine dollars when the lease is signed in-app." },
];

async function tts(text, prev, next, out) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text, model_id: MODEL,
    voice_settings: { stability: 0.42, similarity_boost: 0.78, style: 0.45, use_speaker_boost: true, speed: 1.02 },
    ...(prev ? { previous_text: prev } : {}),
    ...(next ? { next_text: next } : {}),
  };
  const r = await fetch(url, { method: "POST", headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`TTS failed (${r.status}): ${await r.text()}`);
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
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
