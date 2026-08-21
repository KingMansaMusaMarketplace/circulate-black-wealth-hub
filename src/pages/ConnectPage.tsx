import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import {
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  Bot,
  Code,
} from 'lucide-react';

const projectRef =
  (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID ?? 'agoclnqfyinwjxdmjnns';
const MCP_URL = `https://${projectRef}.supabase.co/functions/v1/mcp`;

const ConnectPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>Connect 1325.AI to ChatGPT, Claude & Cursor | 1325.AI</title>
        <meta
          name="description"
          content="Connect the 1325.AI directory and loyalty tools to ChatGPT, Claude, Cursor, and other AI assistants in a few clicks."
        />
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 text-mansagold mb-3">
          <Sparkles className="w-5 h-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Agent Integrations
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Connect 1325.AI to your AI assistant
        </h1>
        <p className="text-white/70 mb-8 md:text-lg">
          Let ChatGPT, Claude, Cursor, and other AI assistants search the 1325.AI
          directory, browse rewards, and check your loyalty points — on your
          behalf, after you sign in.
        </p>
        <p className="text-white/60 mb-8 text-sm">
          Looking for technical details?{' '}
          <a href="/connect/docs" className="text-mansagold hover:underline">
            Read the connector documentation
          </a>
          .
        </p>

        {/* Server URL card */}
        <section
          aria-label="MCP server URL"
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-6 mb-10"
        >
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-mansagold" aria-hidden />
            <span>Your 1325.AI server URL</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <code className="flex-1 break-all rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm font-mono text-mansagold">
              {MCP_URL}
            </code>
            <Button
              onClick={copy}
              className="bg-mansagold text-black hover:bg-mansagold/90 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" /> Copy URL
                </>
              )}
            </Button>
          </div>
          <p className="text-white/50 text-xs mt-3">
            Paste this URL into your AI assistant when it asks for a connector,
            server, or MCP URL. You'll sign in with your 1325.AI account to
            approve the connection.
          </p>

          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-white/70 text-sm mb-3">
              One-tap shortcuts — opens the connector setup in a new tab:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <a
                  href="https://claude.ai/customize/connectors?modal=add-custom-connector"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Claude
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <a
                  href="https://chatgpt.com/#settings/Connectors/Advanced"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open ChatGPT
                </a>
              </Button>
              <Button
                asChild
                className="bg-mansagold text-black hover:bg-mansagold/90 font-semibold"
              >
                <a
                  href="https://cursor.com/en/install-mcp?name=1325ai&config=eyJ1cmwiOiJodHRwczovL2Fnb2NsbnFmeWlud2p4ZG1qbm5zLnN1cGFiYXNlLmNvL2Z1bmN0aW9ucy92MS9tY3AifQ%3D%3D"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Add to Cursor (1 click)
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <a
                  href="https://www.cursor.com/settings"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Cursor
                </a>
              </Button>
            </div>
            <p className="text-white/40 text-xs mt-3">
              Tip: click Copy URL first, then a shortcut — paste the URL when
              the assistant asks for it. Cursor users can skip that with the
              one-click button, or install from our{' '}
              <a
                href="https://cursor.directory/plugins/1325ai"
                target="_blank"
                rel="noreferrer noopener"
                className="text-mansagold underline underline-offset-2"
              >
                cursor.directory listing
              </a>
              .
            </p>

          </div>
        </section>

        {/* ChatGPT */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-mansagold" />
            Connect from ChatGPT
          </h2>
          <ol className="space-y-3 list-decimal pl-5 text-white/80">
            <li>
              Open{' '}
              <a
                className="text-mansagold underline"
                href="https://chatgpt.com/#settings/Connectors/Advanced"
                target="_blank"
                rel="noreferrer noopener"
              >
                ChatGPT → Settings → Connectors → Advanced
              </a>{' '}
              and turn on <strong>Developer mode</strong> (read the risk notice
              shown there).
            </li>
            <li>
              In the chat composer, click the <strong>“+”</strong> menu and
              turn on <strong>Developer mode</strong>.
            </li>
            <li>
              Click <strong>Add sources</strong>, then{' '}
              <strong>Connect more</strong>.
            </li>
            <li>
              Name it <em>1325.AI</em> and paste the server URL above.
            </li>
            <li>
              Sign in with your 1325.AI account and approve the connection.
            </li>
            <li>
              Try it: ask ChatGPT{' '}
              <em>“Using 1325.AI, find hair salons in Chicago.”</em>
            </li>
          </ol>
        </section>

        {/* Claude */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-mansagold" />
            Connect from Claude
          </h2>
          <ol className="space-y-3 list-decimal pl-5 text-white/80">
            <li>
              Open{' '}
              <a
                className="text-mansagold underline"
                href="https://claude.ai/customize/connectors?modal=add-custom-connector"
                target="_blank"
                rel="noreferrer noopener"
              >
                Claude → Custom connectors
              </a>
              .
            </li>
            <li>
              Name it <em>1325.AI</em> and paste the server URL above.
            </li>
            <li>
              Sign in with your 1325.AI account and approve the connection.
            </li>
            <li>
              Enable the connector from Claude's chat composer, then ask{' '}
              <em>“Using 1325.AI, what's my loyalty points balance?”</em>
            </li>
          </ol>
        </section>

        {/* Cursor */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-mansagold" />
            Connect from Cursor
          </h2>
          <ol className="space-y-3 list-decimal pl-5 text-white/80">
            <li>
              Open Cursor and go to{' '}
              <strong>Settings → MCP</strong> (or open the command palette and
              search for “MCP”).
            </li>
            <li>
              Click <strong>Add new MCP server</strong>.
            </li>
            <li>
              Name it <em>1325.AI</em>, set the transport to{' '}
              <strong>HTTP / SSE</strong>, and paste the server URL above.
            </li>
            <li>
              Save the server. Cursor will show a green check when it connects.
            </li>
            <li>
              Sign in with your 1325.AI account and approve the connection.
            </li>
            <li>
              In Composer, mention the 1325.AI tool and ask something like{' '}
              <em>“Find Black-owned restaurants in Chicago using 1325.AI.”</em>
            </li>
          </ol>
        </section>

        {/* Refresh */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-mansagold" />
            Refresh after the app changes
          </h2>
          <p className="text-white/70 mb-4">
            AI assistants cache the tool list. After 1325.AI adds or updates
            tools, refresh the connector to get the latest features.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">ChatGPT</h3>
              <p className="text-white/70 text-sm">
                Open ChatGPT's app preferences, find 1325.AI under Enabled apps,
                and click <strong>Refresh</strong> next to Information.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Claude</h3>
              <p className="text-white/70 text-sm">
                Open the Connectors page, select the 1325.AI connector, and click{' '}
                <strong>Refresh tools</strong>.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Cursor</h3>
              <p className="text-white/70 text-sm">
                Open Settings → MCP, select the 1325.AI server, and click{' '}
                <strong>Refresh</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* What it can do */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">
            What your assistant can do
          </h2>
          <p className="text-white/70">
            Search the Black-owned global business directory, browse active loyalty
            rewards, and — once you sign in — check your loyalty points and
            recent QR scans. Your assistant only sees what you'd see in your
            own account.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ConnectPage;
