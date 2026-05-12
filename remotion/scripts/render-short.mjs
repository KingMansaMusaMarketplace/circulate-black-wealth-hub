import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUT = "/mnt/documents/1325AI-short-35s-v5-silent.mp4";

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

const composition = await selectComposition({ serveUrl: bundled, id: "short", puppeteerInstance: browser });
console.log(`Rendering ${composition.durationInFrames}f @ ${composition.fps}fps -> ${OUT}`);
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: OUT,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
  crf: 10,
  pixelFormat: "yuv420p",
  imageFormat: "png",
  x264Preset: "slow",
});
console.log("Done:", OUT);
await browser.close({ silent: false });
