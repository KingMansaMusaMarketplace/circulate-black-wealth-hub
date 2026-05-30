import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || "both"; // "video" | "vertical" | "both"

const VO = path.resolve(__dirname, "../public/audio/vo-mansa-stays.mp3");

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

async function renderWithVO(id, finalOut) {
  const composition = await selectComposition({ serveUrl: bundled, id, puppeteerInstance: browser });
  const silent = `/tmp/${id}-silent.mp4`;
  console.log(`Render ${id}: ${composition.durationInFrames}f ${composition.width}x${composition.height} -> ${silent}`);
  await renderMedia({
    composition, serveUrl: bundled, codec: "h264",
    outputLocation: silent, puppeteerInstance: browser,
    muted: true, concurrency: 2,
  });
  const totalSec = composition.durationInFrames / composition.fps;
  console.log(`Muxing VO -> ${finalOut}`);
  execSync(
    `ffmpeg -y -i "${silent}" -i "${VO}" -c:v copy -c:a aac -b:a 192k -shortest -t ${totalSec} "${finalOut}"`,
    { stdio: "inherit" }
  );
  console.log("Done:", finalOut);
}

if (mode === "vertical") {
  await renderWithVO("mansa-stays-vertical", "/mnt/documents/MansaStays-HowToList-2min-Vertical.mp4");
} else if (mode === "video") {
  await renderWithVO("mansa-stays", "/mnt/documents/MansaStays-HowToList-2min.mp4");
} else {
  await renderWithVO("mansa-stays", "/mnt/documents/MansaStays-HowToList-2min.mp4");
  await renderWithVO("mansa-stays-vertical", "/mnt/documents/MansaStays-HowToList-2min-Vertical.mp4");
}

await browser.close({ silent: false });
