// Re-generate the 5-minute capabilities VO with Jessica (excited female).
// Each segment is rendered, measured with ffprobe, then concatenated with
// a small breath gap. Actual durations are written to vo-capabilities-timing.json
// so the Remotion timeline can match them EXACTLY (no drift, no cut-offs).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-capabilities.mp3");
const TIMING_OUT = path.resolve(PROJ, "src/voTiming.json");
const TMP = "/tmp/vo-cap-jessica";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Jessica — warm, expressive, excited
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL = "eleven_multilingual_v2";
const BREATH_MS = 350; // small inter-segment silence

// Tighter, punchier 5-minute script. Scene mapping is enforced by `scene` field.
// Scenes: hook, kayla, capabilities, score, competitive, roi, closing
const segments = [
  { scene: "hook", text: "What if your entire C-Suite never slept… never quit… and cost less than one intern? Meet thirteen twenty-five A-I." },
  { scene: "hook", text: "Thirty-three agentic employees. One subscription. Zero excuses." },

  { scene: "kayla", text: "This is Kayla — your A-I Chief Executive Officer. She leads the workforce, sets strategy, and makes every agent move in lockstep." },
  { scene: "kayla", text: "Behind her? Nine specialist Kaylas — Operations, Finance, Marketing, Revenue, Tech, Growth, Legal, I-R, and more." },

  { scene: "capabilities", text: "Finance. Bookkeeping, taxes, invoicing, collections, forecasting — all automated, all in real time." },
  { scene: "capabilities", text: "Marketing. Content, social, S-E-O, email, and brand design — published daily, on-brand, on-message." },
  { scene: "capabilities", text: "Operations. Customer support, scheduling, vendors, quality, and H-R — running twenty-four seven." },
  { scene: "capabilities", text: "Growth. Lead research, outbound S-D-R, funnel optimization, and partnerships — fueling your pipeline." },
  { scene: "capabilities", text: "Community. Reviews, P-R, events, loyalty, and ambassadors — building the tribe around your brand." },

  { scene: "score", text: "Your Capabilities Score: ninety-four out of one hundred. Top-tier coverage across every business function." },

  { scene: "competitive", text: "Versus the competition? It's not even close. ChatGPT gives you one assistant. We give you thirty-three agents working together." },
  { scene: "competitive", text: "Hiring a real C-Suite costs over two million dollars a year. We deliver the same firepower for two ninety-nine a month." },

  { scene: "roi", text: "Do the math. You replace roughly four full roles. You save twelve thousand, one hundred dollars every single month. That's your R-O-I — instantly." },

  { scene: "closing", text: "This is the future of business — and it's already here. Visit thirteen twenty-five dot A-I and meet your team today." },
  { scene: "closing", text: "Thirteen twenty-five A-I. Your entire C-Suite. One subscription." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: MODEL,
    voice_settings: {
      stability: 0.30,        // expressive / excited
      similarity_boost: 0.78,
      style: 0.60,            // more emotive
      use_speaker_boost: true,
      speed: 1.04,
    },
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

function probeDur(file) {
  const out = execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim();
  return parseFloat(out);
}

const measured = [];
for (let i = 0; i < segments.length; i++) {
  const file = path.join(TMP, `seg-${String(i).padStart(2, "0")}.mp3`);
  if (!(process.env.SKIP_EXISTING && fs.existsSync(file))) {
    console.log(`Seg ${i} [${segments[i].scene}]: generating...`);
    await tts(
      segments[i].text,
      i > 0 ? segments[i - 1].text : null,
      i < segments.length - 1 ? segments[i + 1].text : null,
      file
    );
  } else {
    console.log(`Seg ${i}: cached`);
  }
  const dur = probeDur(file);
  measured.push({ ...segments[i], file, dur });
  console.log(`  -> ${dur.toFixed(2)}s`);
}

// Build a silence file for breath gaps
const silenceFile = path.join(TMP, "breath.mp3");
execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo -t ${BREATH_MS / 1000} -b:a 192k "${silenceFile}"`, { stdio: "pipe" });
const breathSec = probeDur(silenceFile);

// Concat list: seg, breath, seg, breath, ... (no trailing breath)
const listFile = path.join(TMP, "concat.txt");
const lines = [];
measured.forEach((m, idx) => {
  lines.push(`file '${m.file}'`);
  if (idx < measured.length - 1) lines.push(`file '${silenceFile}'`);
});
fs.writeFileSync(listFile, lines.join("\n"));
execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -b:a 192k "${OUT}"`, { stdio: "inherit" });

// Compute scene start/end frames @ 30 fps with breath gaps included.
const FPS = 30;
const HOOK_LEAD = 1.0; // 1s of breathing room before VO begins (logo intro overlays)
let cursor = HOOK_LEAD;
const segmentTimings = measured.map((m, idx) => {
  const start = cursor;
  const end = start + m.dur;
  cursor = end + (idx < measured.length - 1 ? breathSec : 0);
  return { scene: m.scene, text: m.text, startSec: start, endSec: end };
});

// Group by scene
const sceneOrder = ["hook", "kayla", "capabilities", "score", "competitive", "roi", "closing"];
const scenes = sceneOrder.map((name) => {
  const segs = segmentTimings.filter((s) => s.scene === name);
  const start = segs[0].startSec;
  const end = segs[segs.length - 1].endSec;
  return { scene: name, startSec: start, endSec: end, durSec: end - start };
});

// Add tail padding (0.8s) after last scene for breathing room
const tailPad = 0.8;
const totalSec = cursor + tailPad;
const totalFrames = Math.ceil(totalSec * FPS);

// Snap scene durations to frames; ensure back-to-back coverage of full timeline.
const sceneFrames = [];
let frameCursor = 0;
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const isLast = i === scenes.length - 1;
  const startF = i === 0 ? 0 : frameCursor;
  const endF = isLast ? totalFrames : Math.round(s.endSec * FPS);
  sceneFrames.push({ scene: s.scene, fromFrame: startF, durationInFrames: endF - startF });
  frameCursor = endF;
}

// VO offset in frames: VO begins at HOOK_LEAD seconds into the timeline
const voOffsetFrames = Math.round(HOOK_LEAD * FPS);

const timing = {
  fps: FPS,
  totalFrames,
  voOffsetFrames,
  voFile: "audio/vo-capabilities.mp3",
  scenes: sceneFrames,
  segments: segmentTimings.map((s) => ({
    scene: s.scene,
    text: s.text,
    fromFrame: Math.round((s.startSec) * FPS),
    durationInFrames: Math.max(1, Math.round((s.endSec - s.startSec) * FPS)),
  })),
};
fs.writeFileSync(TIMING_OUT, JSON.stringify(timing, null, 2));

console.log(`\n✅ VO: ${OUT}`);
console.log(`✅ Timing: ${TIMING_OUT}`);
console.log(`Total: ${totalSec.toFixed(2)}s = ${totalFrames} frames`);
console.log(`Scenes:`);
sceneFrames.forEach((s) => console.log(`  ${s.scene.padEnd(13)} ${s.fromFrame.toString().padStart(5)}f  (${(s.durationInFrames / FPS).toFixed(1)}s)`));
