// Returns the public Mapbox token to the client.
// pk.* tokens are safe to expose to the browser; we keep this in an edge
// function only because Lovable secrets cannot use the VITE_ prefix.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const token = Deno.env.get("MAPBOX_PUBLIC_TOKEN") ?? "";
  return new Response(JSON.stringify({ token }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
