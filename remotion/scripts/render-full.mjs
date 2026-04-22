import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");

const COMP_ID = "full";
const TOTAL_FRAMES = 3060;
const FPS = 30;
const INTRO = 36;
const VO_PATH = path.resolve(PROJ, "public/audio/vo-90.mp3");
const FINAL = "/mnt/documents/1325AI-agentic-90s-v1.mp4";

// Chunk plan: 4 segments of 765 frames each (25.5s each) -> well under 10min budget per chunk
const CHUNKS = [
  { from: 0, to: 765 },
  { from: 765, to: 1530 },
  { from: 1530, to: 2295 },
  { from: 2295, to: 3060 },
];

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(PROJ, "src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: COMP_ID, puppeteerInstance: browser });
console.log(`Composition: ${composition.durationInFrames}f @ ${composition.fps}fps  ${composition.width}x${composition.height}`);

// Allow rendering only specific chunks via env var (e.g. CHUNK=2 renders only chunk index 2)
const onlyChunk = process.env.CHUNK ? parseInt(process.env.CHUNK, 10) : null;

const chunkFiles = [];
for (let i = 0; i < CHUNKS.length; i++) {
  const c = CHUNKS[i];
  const out = `/tmp/full-chunk-${i}.mp4`;
  chunkFiles.push(out);
  if (onlyChunk !== null && onlyChunk !== i) {
    console.log(`Skipping chunk ${i} (CHUNK=${onlyChunk})`);
    continue;
  }
  if (process.env.SKIP_EXISTING && fs.existsSync(out)) {
    console.log(`Chunk ${i} exists, skipping.`);
    continue;
  }
  console.log(`\n=== Rendering chunk ${i}: frames ${c.from}-${c.to - 1} -> ${out} ===`);
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
  console.log(`Chunk ${i} done.`);
}

await browser.close({ silent: false });

if (onlyChunk !== null) {
  console.log("Single-chunk mode. Skipping concat/mux.");
  process.exit(0);
}

// Concat chunks
const listFile = "/tmp/concat-list.txt";
fs.writeFileSync(listFile, chunkFiles.map((f) => `file '${f}'`).join("\n"));
const silent = "/tmp/full-silent.mp4";
console.log("\nConcatenating chunks...");
execSync(`ffmpeg -y -f concat -safe 0 -i ${listFile} -c copy "${silent}"`, { stdio: "inherit" });

// Mux VO with intro delay so it lines up after the logo bumper
const introDelayMs = Math.round((INTRO / FPS) * 1000);
const totalSec = TOTAL_FRAMES / FPS;
console.log(`\nMuxing VO (delay ${introDelayMs}ms) -> ${FINAL}`);
execSync(
  `ffmpeg -y -i "${silent}" -i "${VO_PATH}" -c:v copy -c:a aac -b:a 192k -af "adelay=${introDelayMs}|${introDelayMs},apad" -t ${totalSec} -shortest "${FINAL}"`,
  { stdio: "inherit" }
);
console.log(`\n✅ Done: ${FINAL}`);
const stat = fs.statSync(FINAL);
console.log(`File size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
