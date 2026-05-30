import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser, renderStill } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || "video"; // "still" or "video"
const frame = parseInt(process.argv[3] || "1800", 10);

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

const composition = await selectComposition({
  serveUrl: bundled,
  id: "mansa-stays",
  puppeteerInstance: browser,
});

if (mode === "still") {
  const out = `/tmp/ms-frame-${frame}.png`;
  console.log(`Rendering still at frame ${frame} -> ${out}`);
  await renderStill({ composition, serveUrl: bundled, output: out, frame, puppeteerInstance: browser });
  console.log("Done:", out);
} else {
  const out = "/mnt/documents/MansaStays-HowToList-2min.mp4";
  console.log(`Rendering ${composition.durationInFrames}f @ ${composition.fps}fps -> ${out}`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: out,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 2,
  });
  console.log("Done:", out);
}

await browser.close({ silent: false });
