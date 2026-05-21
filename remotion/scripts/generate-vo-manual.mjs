// Generate VO for the 4-minute Complete Platform Manual explainer.
// 9 segments, padded to exact durations to match the Remotion timeline.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-manual.mp3");
const TMP = "/tmp/vo-manual-segments";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Jessica — warm, expressive, conversational
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL = "eleven_multilingual_v2";

const segments = [
  { dur: 17,
    text: "From the founder, Thomas D. Bowling — this is thirteen twenty-five A-I. The Complete Platform Manual. The agentic operating system for the next billion businesses." },
  { dur: 26,
    text: "For two decades, small business owners were sold a lie — that better software would set them free. What it delivered was thirty-six logins, four C-R-Ms, and a Friday spreadsheet they still had to assemble themselves. Thirteen twenty-five A-I ends that era — architected by Thomas D. Bowling, Founder, Chairman, and Chief Architect." },
  { dur: 22,
    text: "The problem is simple. The average small business spends the equivalent of four full roles — over twelve thousand, one hundred dollars every month — just stitching disconnected tools together. Marketing here. Bookkeeping there. Customer service in a third tab. Nothing talks. Nothing remembers." },
  { dur: 30,
    text: "Our answer: one platform. One subscription. One workforce. Kayla — the orchestrator — and thirty-three specialized A-I employees. They share a unified memory. They route across the best frontier models — G-P-T, Claude, Gemini, and Llama. They learn from every conversation. This is not a chatbot. This is an agentic operating system, sitting on one hundred forty-nine edge functions and three hundred sixteen production database tables." },
  { dur: 38,
    text: "Finance. Bookkeeper, tax strategist, invoice manager, collections, budget analyst — five agents keeping your money working. Marketing. Content, social, S-E-O, email, brand design — five agents amplifying your voice. Operations. Support, scheduling, vendors, quality, H-R — five agents keeping everything running. Growth. Lead research, outbound, funnel optimization, partnerships — four agents fueling the pipeline. Community. Reviews, P-R, events, loyalty, ambassadors — five agents building your tribe." },
  { dur: 28,
    text: "Now do the math. Plans start at nineteen dollars a month and scale to two ninety-nine for the full Pro tier. The average customer gains roughly four roles of coverage — saving twelve thousand, one hundred dollars every single month. Lifetime value over customer acquisition cost — seventeen point six times. Projected fiscal year twenty-twenty-eight A-R-R — ninety-six million dollars." },
  { dur: 24,
    text: "And we're more than software. Mansa Stays — our short-term rental platform — is fully operational, with Stripe Connect host payouts and six hundred fifty optimized landing pages. Noire Rideshare — our driver network — runs at an eighty percent driver take-rate, with a B-to-B hotel concierge channel. Both are live. Both are growing." },
  { dur: 22,
    text: "The moat is real. Twenty-seven patent claims under U-S-P-T-O sixty-three slash nine-six-nine, two-oh-two. An N-D-A first investor portal. Sixteen revenue streams — SaaS, transaction fees, B-to-B match, sponsorships, developer A-P-I, and more. Production infrastructure — not slideware." },
  { dur: 33,
    text: "Thirteen twenty-five A-I is raising thirty million dollars Series A at a one hundred million dollar post-money valuation. The agentic A-I standard for small business will be set in the next twenty-four months — and we intend to set it. From the desk of Thomas D. Bowling, Founder, Chairman, and Chief Architect. Visit thirteen twenty-five dot A-I — and meet your entire C-Suite today." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: MODEL,
    voice_settings: {
      stability: 0.38,
      similarity_boost: 0.78,
      style: 0.50,
      use_speaker_boost: true,
      speed: 1.02,
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
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(outFile, buf);
}

const segmentFiles = [];
for (let i = 0; i < segments.length; i++) {
  const file = path.join(TMP, `seg-${String(i).padStart(2, "0")}.mp3`);
  segmentFiles.push({ file, dur: segments[i].dur });
  if (process.env.SKIP_EXISTING && fs.existsSync(file)) {
    console.log(`Seg ${i}: cached`);
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
