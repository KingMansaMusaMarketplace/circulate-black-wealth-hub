import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INTRO_FRAMES = 36;
const COMPOSITIONS = [
  { id: "main", out: "/mnt/documents/1325AI-cinematic-30s-v5.mp4", vo: "remotion/public/audio/vo-30.mp3" },
  { id: "reel", out: "/mnt/documents/1325AI-reel-15s-v5.mp4", vo: "remotion/public/audio/vo-15.mp3" },
];

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

for (const comp of COMPOSITIONS) {
  console.log(`\n=== ${comp.id} ===`);
  const composition = await selectComposition({ serveUrl: bundled, id: comp.id, puppeteerInstance: browser });
  const silent = `/tmp/${comp.id}-silent.mp4`;
  console.log(`Rendering ${composition.durationInFrames}f @ ${composition.fps}fps -> ${silent}`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: silent,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log(`Muxing audio with system ffmpeg -> ${comp.out}`);
  const introDelayMs = Math.round((INTRO_FRAMES / composition.fps) * 1000);
  const totalSec = composition.durationInFrames / composition.fps;
  // Delay VO by intro length so it lines up with Scene 1 (post-bumper); pad with silence to full length.
  execSync(`ffmpeg -y -i "${silent}" -i "${path.resolve(__dirname, "..", "..", comp.vo)}" -c:v copy -c:a aac -b:a 192k -af "adelay=${introDelayMs}|${introDelayMs},apad" -t ${totalSec} "${comp.out}"`, { stdio: "inherit" });
  console.log(`Done: ${comp.out}`);
}

await browser.close({ silent: false });
console.log("\nAll renders complete.");

