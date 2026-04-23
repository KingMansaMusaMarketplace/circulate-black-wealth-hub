import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";

const PROJ = "/dev-server/remotion";
const compId = process.argv[2] || "agentic";
const frame = parseInt(process.argv[3] || "600", 10);
const out = process.argv[4] || `/tmp/check-${compId}-${frame}.png`;

const bundled = await bundle({ entryPoint: path.resolve(PROJ, "src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: compId, puppeteerInstance: browser });
await renderStill({ composition, serveUrl: bundled, output: out, frame, puppeteerInstance: browser });
await browser.close({ silent: false });
console.log("Wrote", out);
