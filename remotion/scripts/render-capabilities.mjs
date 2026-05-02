import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");

const COMP_ID = "capabilities";
const TOTAL_FRAMES = 8730;
const FINAL = "/mnt/documents/1325AI-Kayla-Capabilities-Report-5min.mp4";

// Render in 3 chunks of ~2910 frames each (~97s) to stay under per-call timeouts.
const CHUNK_SIZE = 2910;
const NUM_CHUNKS = Math.ceil(TOTAL_FRAMES / CHUNK_SIZE);
const CHUNKS = Array.from({ length: NUM_CHUNKS }, (_, i) => ({
  from: i * CHUNK_SIZE,
  to: Math.min((i + 1) * CHUNK_SIZE, TOTAL_FRAMES),
}));

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

const onlyChunk = process.env.CHUNK ? parseInt(process.env.CHUNK, 10) : null;

const chunkFiles = [];
for (let i = 0; i < CHUNKS.length; i++) {
  const c = CHUNKS[i];
  const out = `/tmp/capabilities-chunk-${i}.mp4`;
  chunkFiles.push(out);
  if (onlyChunk !== null && onlyChunk !== i) {
    console.log(`Skipping chunk ${i}`);
    continue;
  }
  if (process.env.SKIP_EXISTING && fs.existsSync(out)) {
    console.log(`Chunk ${i} cached`);
    continue;
  }
  console.log(`\n=== Chunk ${i}: frames ${c.from}-${c.to - 1} -> ${out} ===`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: out,
    puppeteerInstance: browser,
    muted: true, // we mux VO at the end
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

// Concat
import { execSync } from "child_process";
const listFile = "/tmp/capabilities-concat.txt";
fs.writeFileSync(listFile, chunkFiles.map((f) => `file '${f}'`).join("\n"));
const silent = "/tmp/capabilities-silent.mp4";
console.log("\nConcatenating chunks...");
execSync(`ffmpeg -y -f concat -safe 0 -i ${listFile} -c copy "${silent}"`, { stdio: "inherit" });

const VO_PATH = path.resolve(PROJ, "public/audio/vo-capabilities.mp3");
const totalSec = TOTAL_FRAMES / composition.fps;
console.log(`\nMuxing VO -> ${FINAL}`);
execSync(
  `ffmpeg -y -i "${silent}" -i "${VO_PATH}" -c:v copy -c:a aac -b:a 192k -t ${totalSec} -shortest "${FINAL}"`,
  { stdio: "inherit" }
);
console.log(`\n✅ Done: ${FINAL}`);
const stat = fs.statSync(FINAL);
console.log(`File size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
