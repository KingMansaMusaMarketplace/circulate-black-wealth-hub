import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const PROJ = "/dev-server/remotion";
const bundled = await bundle({ entryPoint: path.resolve(PROJ, "src/index.ts"), webpackOverride: c => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "directors-cut", puppeteerInstance: browser });
for (const f of [1950, 2050, 2150]) {
  await renderStill({ composition, serveUrl: bundled, output: `/tmp/dc-${f}.png`, frame: f, puppeteerInstance: browser });
  console.log("frame", f);
}
await browser.close({ silent: false });
