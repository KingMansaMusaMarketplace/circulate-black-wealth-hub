// Generate VO for 90s Vendor Onboarding explainer (List Your Business in 3 Steps).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-vendor-onboarding.mp3");
const TMP = "/tmp/vo-vendor-onboarding-segments";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

const VOICE_ID = "cgSgspJ2msm6clMCkdW9"; // Jessica
const MODEL = "eleven_multilingual_v2";

const segments = [
  { dur: 2, text: " " }, // lead-in silence under title stamp
  // Hook 2-12s (10s)
  { dur: 10, text: "Own a business? Here's how to list it on thirteen twenty-five A-I, reach new customers, and grow — in three simple steps." },
  // Why 12-24s (12s)
  { dur: 12, text: "Listing is free, forever. Businesses on our platform see about thirty-eight percent more repeat visits — and Kayla, your A-I employee, manages it all for you, around the clock." },
  // Step 1 24-40s (16s)
  { dur: 16, text: "Step one — claim or list. Visit thirteen twenty-five dot A-I and create your free business account. Add your name, category, hours, photos, and the discount you want to offer members. Listing is free, forever." },
  // Step 2 40-56s (16s)
  { dur: 16, text: "Step two — print your Q-R. We auto-generate a unique Q-R code for your storefront and checkout. Print it, place it, done. Every scan is tracked, every discount redeems instantly, and every customer joins your loyalty list." },
  // Step 3 56-74s (18s)
  { dur: 18, text: "Step three — grow on autopilot. Members find you in the directory and walk in. Kayla handles bookings, replies to reviews, posts updates, and shows you exactly what's working. You focus on serving customers." },
  // CTA 74-90s (16s)
  { dur: 16, text: "That's it. List. Print. Grow. Join the movement and list your business today at thirteen twenty-five dot A-I, slash business-signup." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: MODEL,
    voice_settings: { stability: 0.4, similarity_boost: 0.78, style: 0.45, use_speaker_boost: true, speed: 1.0 },
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

const segmentFiles = [];
for (let i = 0; i < segments.length; i++) {
  const file = path.join(TMP, `seg-${String(i).padStart(2, "0")}.mp3`);
  segmentFiles.push({ file, dur: segments[i].dur });
  if (segments[i].text.trim() === "") {
    execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo -t ${segments[i].dur} -b:a 192k "${file}"`, { stdio: "pipe" });
    continue;
  }
  console.log(`Seg ${i} (${segments[i].dur}s): generating...`);
  await tts(
    segments[i].text,
    i > 0 ? segments[i - 1].text : null,
    i < segments.length - 1 ? segments[i + 1].text : null,
    file
  );
}

const paddedFiles = [];
for (let i = 0; i < segmentFiles.length; i++) {
  const { file, dur } = segmentFiles[i];
  const padded = path.join(TMP, `pad-${String(i).padStart(2, "0")}.mp3`);
  paddedFiles.push(padded);
  execSync(
    `ffmpeg -y -i "${file}" -af "apad=whole_dur=${dur},atrim=0:${dur},asetpts=N/SR/TB" -ar 44100 -ac 2 -b:a 192k "${padded}"`,
    { stdio: "pipe" }
  );
}

const listFile = path.join(TMP, "concat.txt");
fs.writeFileSync(listFile, paddedFiles.map((f) => `file '${f}'`).join("\n"));
execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${OUT}"`, { stdio: "inherit" });

const totalDur = segments.reduce((a, s) => a + s.dur, 0);
const stat = fs.statSync(OUT);
console.log(`\n✅ VO written: ${OUT}`);
console.log(`Total: ${totalDur}s · ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
