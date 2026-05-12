import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const PROJ = "/dev-server/remotion";
const COMP = "directors-cut";
const FINAL = "/mnt/documents/1325AI-directors-cut.mp4";

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(PROJ, "src/index.ts"),
  webpackOverride: (c) => c,
});

console.log("Browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: COMP, puppeteerInstance: browser });
console.log(`Composition: ${composition.durationInFrames}f @ ${composition.fps}fps`);

const TOTAL = composition.durationInFrames;
const CHUNK = 1000;
const chunks = [];
for (let from = 0; from < TOTAL; from += CHUNK) {
  const to = Math.min(from + CHUNK, TOTAL);
  chunks.push({ from, to });
}

const chunkFiles = [];
for (let i = 0; i < chunks.length; i++) {
  const c = chunks[i];
  const out = `/tmp/dc-chunk-${i}.mp4`;
  chunkFiles.push(out);
  console.log(`\n=== Chunk ${i}: ${c.from}-${c.to - 1} ===`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: out,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
    frameRange: [c.from, c.to - 1],
  });
}

await browser.close({ silent: false });

// Concat
const list = "/tmp/dc-list.txt";
fs.writeFileSync(list, chunkFiles.map((f) => `file '${f}'`).join("\n"));
const silent = "/tmp/dc-silent.mp4";
console.log("\nConcat...");
execSync(`ffmpeg -y -f concat -safe 0 -i ${list} -c copy "${silent}"`, { stdio: "inherit" });

// Build audio mix: music bed (full duration ducked) + 6 VO tracks at offsets
const FPS = 30;
const INTRO = 60;
const SCENES = [
  { dur: 330, vo: "s1-hook"      },
  { dur: 330, vo: null           },
  { dur: 300, vo: "s3-thesis"    },
  { dur: 330, vo: "s4-agents"    },
  { dur: 330, vo: null           },
  { dur: 360, vo: "s6-math"      },
  { dur: 330, vo: null           },
  { dur: 330, vo: "s8-manifesto" },
  { dur: 240, vo: "s9-closing"   },
];
let cursor = INTRO;
const voInputs = [];
for (const s of SCENES) {
  if (s.vo) voInputs.push({ offsetMs: Math.round(((cursor + 20) / FPS) * 1000), file: `${PROJ}/public/audio/dc/${s.vo}.mp3` });
  cursor += s.dur;
}
const totalSec = TOTAL / FPS;

// ffmpeg: bed at 0.28 + each vo delayed
const inputs = [`-i "${silent}"`, `-i "${PROJ}/public/audio/dc/bed.mp3"`];
voInputs.forEach((v) => inputs.push(`-i "${v.file}"`));

const filterParts = [`[1:a]volume=0.28[bed]`];
voInputs.forEach((v, i) => {
  filterParts.push(`[${i + 2}:a]adelay=${v.offsetMs}|${v.offsetMs},volume=1.4[vo${i}]`);
});
const mixInputs = ["[bed]", ...voInputs.map((_, i) => `[vo${i}]`)].join("");
filterParts.push(`${mixInputs}amix=inputs=${voInputs.length + 1}:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]`);
const filter = filterParts.join(";");

const cmd = `ffmpeg -y ${inputs.join(" ")} -filter_complex "${filter}" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -t ${totalSec} -shortest "${FINAL}"`;
console.log("\nMux:", cmd);
execSync(cmd, { stdio: "inherit" });
const stat = fs.statSync(FINAL);
console.log(`\n✅ ${FINAL} ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
