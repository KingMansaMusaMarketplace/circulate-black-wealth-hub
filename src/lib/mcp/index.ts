import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchDirectoryTool from "./tools/search-directory";
import getBusinessTool from "./tools/get-business";
import listRewardsTool from "./tools/list-rewards";
import getMyPointsBalanceTool from "./tools/get-my-points-balance";
import getMyRecentScansTool from "./tools/get-my-recent-scans";

// OAuth issuer MUST be the direct https://<project-ref>.supabase.co host,
// never a proxy. Read the project ref from a Vite-inlined env var so the
// entry stays import-safe (no runtime env read at module top level).
const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "1325-ai-mcp",
  title: "1325.AI",
  version: "0.1.0",
  instructions:
    "Search the 1325.AI community business directory, browse loyalty rewards, and view the signed-in user's points and recent QR scans. Read-only tools; no purchases or redemptions are performed here.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchDirectoryTool,
    getBusinessTool,
    listRewardsTool,
    getMyPointsBalanceTool,
    getMyRecentScansTool,
  ],
});
