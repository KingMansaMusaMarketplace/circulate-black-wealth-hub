// Generate VO for the 90s Customer Flow explainer (How to Save in 3 Steps).
// Segments padded to exact scene durations to lock to the Remotion timeline.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-customer-flow.mp3");
const TMP = "/tmp/vo-customer-flow-segments";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Jessica — warm, conversational
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL = "eleven_multilingual_v2";

// Total 90s. Each segment's `dur` is padded silence-locked.
const segments = [
  { dur: 2, text: " " }, // lead-in silence for title stamp
  // Hook 2-12s (10s)
  { dur: 10, text: "Want to save money — and build community wealth at the same time? Here's how, in three simple steps." },
  // Why 12-24s (12s)
  { dur: 12, text: "When you shop at Black-owned businesses through thirteen twenty-five A-I, you get five to thirty percent off — and every dollar circulates six to nine times in your community." },
  // Step 1 24-40s (16s)
  { dur: 16, text: "Step one — sign up. Visit thirteen twenty-five dot A-I and create your free account. No credit card. No subscription. Full access to the directory in about thirty seconds." },
  // Step 2 40-56s (16s)
  { dur: 16, text: "Step two — discover. Search by category, neighborhood, or distance. Filter by food, beauty, retail, and more. See ratings, hours, and the exact discount waiting for you." },
  // Step 3 56-74s (18s)
  { dur: 18, text: "Step three — scan and save. Visit a business and scan the Q-R code at checkout. Your discount applies on the spot — and you earn loyalty points every single time you shop." },
  // CTA 74-90s (16s)
  { dur: 16, text: "That's it. Sign up. Discover. Scan and save. Start saving today — and support your community. Visit thirteen twenty-five dot A-I." },
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
    // Pure silence segment
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
