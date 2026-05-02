// Generate authoritative male VO (Brian) for the Capabilities & Competitive Report video.
// Uses ElevenLabs request stitching for smooth prosody between segments.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-capabilities.mp3");
const TMP = "/tmp/vo-capabilities-segments";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Brian — authoritative, documentary male
const VOICE_ID = "nPczCjzI2devNBz1zQrb";
const MODEL = "eleven_multilingual_v2";

// Total target: 300s (5:00). Each segment dur is exact playback budget.
const segments = [
  // SCENE 1 — Cold open hook (0–18s)
  { dur: 6.0, text: "What if your entire C-suite worked twenty-four seven... never slept... and never asked for a raise?" },
  { dur: 6.0, text: "What if thirty-three world-class executives... ran your business... for less than the price of one intern?" },
  { dur: 6.0, text: "This isn't science fiction. This is Kayla. And this... is the future of business." },

  // SCENE 2 — Meet Kayla & the 33 (18–50s = 32s)
  { dur: 7.0, text: "Meet Kayla — the Chief Executive Officer of an entire artificial intelligence workforce." },
  { dur: 8.5, text: "Behind her, thirty-three specialized agents — across nine C-suite roles and five operational departments — work in perfect coordination." },
  { dur: 8.0, text: "Finance. Marketing. Operations. Growth. Community. Every function of a Fortune 500 company... compressed into one platform." },
  { dur: 8.5, text: "And unlike every other A-I tool on the market today, these agents share a single brain — a unified memory system that makes them smarter every hour." },

  // SCENE 3 — Capabilities reel (50s–2:20 = 90s)
  { dur: 7.0, text: "Let's talk capabilities. Start with Finance." },
  { dur: 9.0, text: "Kayla Finance forecasts your cash flow in real time. She reconciles transactions, prepares your taxes, optimizes your prices, and flags anomalies before they become losses." },
  { dur: 8.0, text: "Her team of five specialists handles bookkeeping, collections, invoicing, budgeting, and tax strategy — all autonomously." },

  { dur: 7.0, text: "Then there's Marketing." },
  { dur: 9.5, text: "Kayla Marketing writes your content, runs your campaigns, schedules your social posts, optimizes your S-E-O, and designs your brand assets — all while learning what actually converts your audience." },

  { dur: 6.5, text: "Operations? Fully automated." },
  { dur: 9.0, text: "Customer support agents respond in seconds. Schedulers manage your calendar. Vendor liaisons handle procurement. Quality auditors monitor every transaction. H-R coordinators onboard new hires." },

  { dur: 6.5, text: "Growth never stops." },
  { dur: 9.0, text: "Lead researchers find your next customer. Outbound S-D-R agents send personalized outreach. Funnel optimizers test your conversion paths. Partnership scouts identify strategic alliances." },

  { dur: 6.0, text: "And Community — the secret weapon." },
  { dur: 8.5, text: "Reviews managers protect your reputation. P-R liaisons pitch the press. Event coordinators plan activations. Loyalty programs reward your best customers." },

  // SCENE 4 — The 99/100 score (2:20–3:00 = 40s)
  { dur: 7.0, text: "So why does this system score ninety-nine out of one hundred on agentic maturity?" },
  { dur: 9.0, text: "Three reasons. First — a shared business context. Every agent reads from and writes to the same memory before making decisions." },
  { dur: 8.0, text: "Second — server-side orchestration. Decisions are coordinated, idempotent, and auditable, not scattered across browser tabs." },
  { dur: 8.0, text: "Third — full reasoning transparency. Every recommendation comes with a Why-This-Card explaining the inputs, the logic, and the confidence." },
  { dur: 8.0, text: "Add a closed-loop learning system — and your agents get measurably smarter every single week." },

  // SCENE 5 — Competitive comparison (3:00–4:00 = 60s)
  { dur: 6.5, text: "Now... let's compare against the rest of the market." },
  { dur: 9.5, text: "OpenAI gives you a chatbot. Powerful — but it has no shared memory across sessions, no business context, and no autonomous action. It waits for your next prompt." },
  { dur: 9.5, text: "Microsoft Copilot integrates with your documents. Useful — but it's an assistant, not an employee. It doesn't run your business. It edits your files." },
  { dur: 10.0, text: "Salesforce Einstein delivers predictions inside Salesforce. Excellent — if you can afford the seven-figure implementation. And it only sees the data you've already structured." },
  { dur: 9.5, text: "Intuit's QuickBooks A-I handles bookkeeping. Solid — but it stops at the ledger. It doesn't market for you. It doesn't sell. It doesn't build community." },
  { dur: 10.0, text: "Kayla does all of it. One subscription. One unified workforce. One shared brain. With patent-pending matchmaking technology no other platform can replicate." },

  // SCENE 6 — ROI (4:00–4:30 = 30s)
  { dur: 6.5, text: "Let's talk numbers. The honest math." },
  { dur: 9.0, text: "Replacing the equivalent of four full-time roles — a bookkeeper, a marketer, a sales development rep, and an operations coordinator — would cost you twelve thousand one hundred dollars per month." },
  { dur: 7.5, text: "Kayla delivers the same output... around the clock... for a fraction of the price." },
  { dur: 6.5, text: "That's a return on investment most businesses only dream about." },

  // SCENE 7 — Closing CTA (4:30–5:00 = 30s)
  { dur: 6.5, text: "This is no longer the future. It's already here." },
  { dur: 8.5, text: "Thirty-three agentic employees. One unified intelligence. One subscription. Zero excuses." },
  { dur: 8.0, text: "Visit thirteen twenty-five dot A-I... and meet your new workforce today." },
  { dur: 7.0, text: "Thirteen twenty-five A-I. The future of business — fully staffed." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: MODEL,
    voice_settings: {
      stability: 0.55,        // higher = more authoritative/consistent
      similarity_boost: 0.80,
      style: 0.35,            // some weight, less stylized than excited
      use_speaker_boost: true,
      speed: 1.0,
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

// Pad each to exact target.
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
console.log(`Total duration: ${totalDur}s (${(totalDur/60).toFixed(2)}min), file size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Segments: ${segments.length}`);
