// Generate excited, human-sounding VO using ElevenLabs (Jessica voice) with request stitching.
// Each segment is rendered independently with tight inter-segment silence to match the new pacing.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");
const OUT = path.resolve(PROJ, "public/audio/vo-agentic.mp3");
const TMP = "/tmp/vo-segments";
fs.mkdirSync(TMP, { recursive: true });

const API_KEY = process.env.ELEVEN_LABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVEN_LABS_API_KEY");

// Jessica — warm, expressive, conversational
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL = "eleven_multilingual_v2";

// Each segment: { dur (sec, must match the AgenticVideo timeline), text }
// The text is shorter than the duration so there's natural breathing room, but
// the trailing silence is small (≤0.5s) so it never feels like a long wait.
// Durations now sized to actual VO + ~0.6s breath, matching AgenticVideo.tsx.
const segments = [
  { dur: 13.2, text: "Thirteen twenty-five A-I presents… meet your A-I C-Suite. Thirty-three agentic employees. One subscription. Zero excuses." },
  { dur: 14.5, text: "First up — meet Kayla, your Chief Executive Officer! She leads the entire A-I workforce, sets strategy, allocates resources, and makes sure every agent works in concert to grow your business." },
  { dur: 12.4, text: "Number two — Kayla Ops, your Chief Operating Officer. She runs day-to-day operations, manages workflows, automates routine tasks, and keeps your business humming twenty-four seven." },
  { dur: 10.6, text: "Number three — Kayla Finance, your Chief Financial Officer. She owns your numbers, tracks revenue, manages cash flow, and forecasts growth in real time." },
  { dur: 10.3, text: "Number four — Kayla Marketing, your Chief Marketing Officer. She builds your brand, crafts campaigns, writes content, and turns audiences into loyal customers." },
  { dur: 11.2, text: "Number five — Kayla Revenue, your Chief Revenue Officer. She closes the deals, qualifies leads, runs sales sequences, and drives top-line growth." },
  { dur: 11.4, text: "Number six — Kayla Tech, your Chief Technology Officer. She powers your stack, integrates tools, monitors uptime, and keeps your infrastructure rock solid." },
  { dur: 10.4, text: "Number seven — Kayla Growth, your Chief Growth Officer. She finds the next wave, tests new channels, and unlocks compounding growth loops." },
  { dur: 10.7, text: "Number eight — Kayla Legal, your Chief Legal Officer. She protects your business, drafts contracts, monitors compliance, and flags risk before it becomes a problem." },
  { dur: 11.6, text: "Number nine — Kayla I-R, your Chief Investor Relations Officer. She speaks to capital, manages investor updates, and keeps your stakeholders confident." },
  { dur: 8.0,  text: "And behind them? Twenty-four specialists working in five elite departments — every hour, every day." },
  { dur: 13.3, text: "Finance department. Bookkeeper. Tax strategist. Invoice manager. Collections agent. Budget analyst. Five agents keeping your money working for you." },
  { dur: 12.0, text: "Marketing department. Content writer. Social manager. S-E-O specialist. Email strategist. Brand designer. Five agents amplifying your voice." },
  { dur: 13.2, text: "Operations department. Customer support. Scheduler. Vendor liaison. Quality auditor. H-R coordinator. Five agents keeping everything running." },
  { dur: 10.0, text: "Growth department. Lead researcher. Outbound S-D-R. Funnel optimizer. Partnership scout. Four agents fueling your pipeline." },
  { dur: 11.3, text: "Community department. Reviews manager. P-R liaison. Event coordinator. Loyalty programs. Ambassador lead. Five agents building your tribe." },
  { dur: 9.0,  text: "Now do the math. A two-million-dollar team for two ninety-nine a month. You're replacing what used to take a thirty-three-person workforce." },
  { dur: 16.0, text: "This is the future of business — and it's already here. Visit thirteen twenty-five dot A-I and meet your new team today. Thirteen twenty-five A-I. Your entire C-Suite. One subscription." },
];

async function tts(text, prevText, nextText, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: MODEL,
    voice_settings: {
      stability: 0.32,        // lower = more expressive/excited
      similarity_boost: 0.78,
      style: 0.55,            // more stylized/emotive
      use_speaker_boost: true,
      speed: 1.05,            // slightly snappier
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

// Pad each segment to its target duration with silence (so concat aligns with timeline).
const paddedFiles = [];
for (let i = 0; i < segmentFiles.length; i++) {
  const { file, dur } = segmentFiles[i];
  const padded = path.join(TMP, `pad-${String(i).padStart(2, "0")}.mp3`);
  paddedFiles.push(padded);
  // apad to exact duration; -af apad,atrim ensures we hit the target length.
  execSync(
    `ffmpeg -y -i "${file}" -af "apad=whole_dur=${dur},atrim=0:${dur},asetpts=N/SR/TB" -ar 44100 -ac 2 -b:a 192k "${padded}"`,
    { stdio: "pipe" }
  );
}

// Concat all padded segments.
const listFile = path.join(TMP, "concat.txt");
fs.writeFileSync(listFile, paddedFiles.map((f) => `file '${f}'`).join("\n"));
execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${OUT}"`, { stdio: "inherit" });

const totalDur = segments.reduce((a, s) => a + s.dur, 0);
const stat = fs.statSync(OUT);
console.log(`\n✅ VO written: ${OUT}`);
console.log(`Total duration: ${totalDur}s, file size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
