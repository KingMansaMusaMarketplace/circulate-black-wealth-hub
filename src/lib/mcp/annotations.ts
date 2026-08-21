/**
 * Helper to attach a human-readable `title` inside a tool's `annotations`
 * object. The MCP specification includes `annotations.title`, but the
 * installed @lovable.dev/mcp-js typings don't declare it yet, so we widen the
 * type here in one place instead of casting at every call site.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withTitle<T extends Record<string, unknown>>(
  title: string,
  annotations: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return { title, ...annotations };
}
