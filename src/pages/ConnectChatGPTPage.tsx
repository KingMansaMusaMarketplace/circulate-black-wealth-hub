import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Link2, MessageSquare, Search, Gift, User, QrCode } from "lucide-react";

const MCP_URL =
  "https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/mcp";

const TOOLS = [
  { icon: Search, title: "Search the 1325.AI directory", desc: "Find Black-owned businesses by keyword, category, or city." },
  { icon: User, title: "Get business details", desc: "Pull the full profile for one business by its ID." },
  { icon: Gift, title: "Browse loyalty rewards", desc: "See what rewards are available and how many points they cost." },
  { icon: Sparkles, title: "Check your points balance", desc: "See your total loyalty points and how they break down by business." },
  { icon: QrCode, title: "See your recent QR scans", desc: "Review your latest visits that earned loyalty points." },
];

const STEPS = [
  {
    title: "Open ChatGPT settings",
    body: "In ChatGPT (chatgpt.com), click your profile picture in the bottom-left, then choose Settings.",
  },
  {
    title: "Go to Connectors",
    body: 'Open the "Connectors" tab (also called "Apps & Connectors" on some plans). This is where ChatGPT connects to outside tools.',
  },
  {
    title: 'Add a new connector',
    body: 'Click "Add" or "Create" and choose the option to add a custom MCP server. (MCP stands for Model Context Protocol — the safe standard AI assistants use to talk to apps.)',
  },
  {
    title: "Paste the 1325.AI address",
    body: (
      <>
        Paste this URL into the server address field:
        <pre className="mt-2 bg-muted rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all">
          {MCP_URL}
        </pre>
      </>
    ),
  },
  {
    title: "Sign in with your 1325.AI account",
    body: 'ChatGPT will open a 1325.AI sign-in window. Log in with the same email you use on our site, then click "Approve" to let ChatGPT act as you. This is read-only — ChatGPT can search and view, but not spend your points or change your account.',
  },
  {
    title: "Try it in a new chat",
    body: 'Start a new ChatGPT conversation and try prompts like: "Use 1325.AI to find Black-owned restaurants in Chicago" or "Check my 1325.AI loyalty points."',
  },
];

export default function ConnectChatGPTPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Connect 1325.AI to ChatGPT | 1325.AI</title>
        <meta
          name="description"
          content="Step-by-step guide to connect the 1325.AI directory and loyalty tools to ChatGPT, Claude, and other AI assistants."
        />
        <link rel="canonical" href="https://1325.ai/connect-chatgpt" />
      </Helmet>

      <main className="container max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            New: Agent Integrations
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connect 1325.AI to ChatGPT
          </h1>
          <p className="text-lg text-muted-foreground">
            Ask ChatGPT (or Claude, Cursor, and other AI assistants) to search the
            1325.AI directory of Black-owned businesses and check your loyalty
            points — right inside your chat.
          </p>
        </header>

        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Safe by design
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              You sign in with your normal 1325.AI account. ChatGPT can only see
              what you can see, and every tool is read-only — no purchases, no
              redemptions, no changes to your account.
            </p>
            <p>
              You can disconnect anytime from ChatGPT's Connectors settings.
            </p>
          </CardContent>
        </Card>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Steps
          </h2>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <div className="text-sm text-muted-foreground">{step.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            What ChatGPT can do
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Card key={t.title}>
                <CardContent className="pt-6">
                  <t.icon className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Try these prompts</h2>
          <div className="space-y-3">
            {[
              "Use 1325.AI to find Black-owned restaurants in Chicago.",
              "Search 1325.AI for beauty salons in Atlanta and give me the top 5.",
              "What's my 1325.AI loyalty points balance?",
              "Show me my last 10 QR scans from 1325.AI.",
              "Browse 1325.AI rewards under 500 points.",
            ].map((p) => (
              <div key={p} className="bg-muted/50 border rounded-lg p-3 text-sm">
                "{p}"
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">I don't see "Connectors" in ChatGPT.</p>
              <p className="text-muted-foreground">
                Custom connectors require ChatGPT Plus, Pro, Team, or Enterprise.
                Free ChatGPT accounts can't add custom MCP servers yet.
              </p>
            </div>
            <div>
              <p className="font-semibold">Sign-in didn't work.</p>
              <p className="text-muted-foreground">
                Make sure you're using the same email you registered with on
                1325.AI. If you're new,{" "}
                <Link to="/auth" className="underline">create an account</Link>{" "}
                first, then try connecting.
              </p>
            </div>
            <div>
              <p className="font-semibold">ChatGPT says "not signed in."</p>
              <p className="text-muted-foreground">
                Disconnect the 1325.AI connector in ChatGPT settings and add it
                again to refresh your login.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Questions? We're here to help.
          </p>
          <Button asChild variant="outline">
            <Link to="/support">Contact support</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
