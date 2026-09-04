import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchDirectoryTool from "./tools/search-directory";
import listCategoriesTool from "./tools/list-categories";
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
  version: "0.1.2",
  instructions:
    "1325.AI is a directory of verified Black-owned businesses in the United States, with loyalty rewards for signed-in users. These tools provide read-only access: search_directory finds businesses by keyword, category, city, state, rating, or geographic radius; list_categories lists available categories and their counts; get_business returns one business profile by id; list_rewards lists active loyalty rewards; get_my_points_balance and get_my_recent_scans return the signed-in user's own loyalty data. No purchases, redemptions, or writes are performed. Data is sourced from 1325.ai.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchDirectoryTool,
    listCategoriesTool,
    getBusinessTool,
    listRewardsTool,
    getMyPointsBalanceTool,
    getMyRecentScansTool,
  ],
});
