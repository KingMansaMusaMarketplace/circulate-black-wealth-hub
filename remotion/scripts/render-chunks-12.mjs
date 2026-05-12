import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const PROJ = "/dev-server/remotion";
const bundled = await bundle({ entryPoint: path.resolve(PROJ, "src/index.ts"), webpackOverride: c => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "directors-cut", puppeteerInstance: browser });
const which = process.argv[2];
if (which === "1") {
  console.log("chunk 1 1000-1999");
  await renderMedia({ composition, serveUrl: bundled, codec: "h264",
    outputLocation: "/tmp/dc-chunk-1.mp4", puppeteerInstance: browser, muted: true, concurrency: 1,
    frameRange: [1000, 1999] });
} else if (which === "2") {
  console.log("chunk 2 2000-2939");
  await renderMedia({ composition, serveUrl: bundled, codec: "h264",
    outputLocation: "/tmp/dc-chunk-2.mp4", puppeteerInstance: browser, muted: true, concurrency: 1,
    frameRange: [2000, 2939] });
}
await browser.close({ silent: false });
console.log("done");
