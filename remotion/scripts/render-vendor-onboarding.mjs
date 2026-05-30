import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FINAL = "/dev-server/public/videos/1325AI-VendorOnboarding-3Steps.mp4";
const BACKUP = "/mnt/documents/1325AI-VendorOnboarding-3Steps.mp4";
const SILENT = "/tmp/vendor-onboarding-silent.mp4";

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

const composition = await selectComposition({ serveUrl: bundled, id: "vendor-onboarding", puppeteerInstance: browser });
console.log(`Rendering: ${composition.durationInFrames}f ${composition.width}x${composition.height} -> ${SILENT}`);

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: SILENT,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 2,
});

const VO_PATH = path.resolve(__dirname, "../public/audio/vo-vendor-onboarding.mp3");
const totalSec = composition.durationInFrames / composition.fps;
fs.mkdirSync(path.dirname(FINAL), { recursive: true });
fs.mkdirSync(path.dirname(BACKUP), { recursive: true });
console.log(`Muxing VO -> ${FINAL}`);
execSync(
  `ffmpeg -y -i "${SILENT}" -i "${VO_PATH}" -c:v copy -c:a aac -b:a 192k -t ${totalSec} -shortest "${FINAL}"`,
  { stdio: "inherit" }
);
fs.copyFileSync(FINAL, BACKUP);

console.log("Done:", FINAL);
const stats = fs.statSync(FINAL);
console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

await browser.close({ silent: false });
