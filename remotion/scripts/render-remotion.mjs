import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPOSITIONS = [
  { id: "main", out: "/mnt/documents/1325AI-cinematic-30s.mp4" },
  { id: "reel", out: "/mnt/documents/1325AI-reel-15s.mp4" },
];

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

for (const comp of COMPOSITIONS) {
  console.log(`\n=== Selecting composition: ${comp.id} ===`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: comp.id,
    puppeteerInstance: browser,
  });

  console.log(`Rendering ${composition.durationInFrames} frames @ ${composition.fps}fps (${composition.width}x${composition.height}) -> ${comp.out}`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: comp.out,
    puppeteerInstance: browser,
    concurrency: 1,
  });
  console.log(`Done: ${comp.out}`);
}

console.log("\nClosing browser...");
await browser.close({ silent: false });
console.log("All renders complete.");
