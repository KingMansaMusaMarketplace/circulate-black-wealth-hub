// Ambient Deno global for tool files that execute inside the generated
// Supabase Edge Function. TypeScript in the Vite app doesn't ship Deno types,
// so we declare the minimal surface the tool handlers use.
declare const Deno: {
  env: { get(name: string): string | undefined };
};
