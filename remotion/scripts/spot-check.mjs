import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");

const bundled = await bundle({ entryPoint: path.resolve(PROJ, "src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "capabilities", puppeteerInstance: browser });

// Sample one frame mid-way through each scene to spot-check
const frames = [60, 800, 1400, 2000, 2700, 3000, 3500, 3900];
for (const f of frames) {
  const out = `/tmp/cap-still-${f}.png`;
  await renderStill({ composition, serveUrl: bundled, output: out, frame: f, puppeteerInstance: browser });
  console.log(`frame ${f} -> ${out}`);
}
await browser.close({ silent: false });
