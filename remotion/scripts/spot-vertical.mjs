import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";

const PROJ = path.resolve("/dev-server/remotion");
console.log("Bundling...");
const bundled = await bundle({ entryPoint: path.resolve(PROJ, "src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "capabilities-vertical", puppeteerInstance: browser });
const frames = [60, 800, 1500, 2200, 2700, 3000, 3500, 3800, 4100];
for (const f of frames) {
  const out = `/tmp/v-spot-${f}.png`;
  await renderStill({ composition, serveUrl: bundled, output: out, frame: f, puppeteerInstance: browser });
  console.log("frame", f, "->", out);
}
await browser.close({ silent: false });
