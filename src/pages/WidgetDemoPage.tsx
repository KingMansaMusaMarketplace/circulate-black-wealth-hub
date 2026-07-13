import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

export default function WidgetDemoPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  const embedCode = `<div id="mansa-search" data-token="${token || "YOUR_PARTNER_TOKEN"}"></div>
<script src="https://1325.ai/widget.js" defer></script>`;

  // Live-reload the widget preview when token changes
  useEffect(() => {
    if (!token || !mountRef.current) return;
    mountRef.current.innerHTML = `<div id="mansa-search" data-token="${token}"></div>`;
    // @ts-expect-error - dynamic remount
    document.querySelectorAll("script[data-mansa]").forEach((s) => s.remove());
    const s = document.createElement("script");
    s.src = "/widget.js";
    s.defer = true;
    s.setAttribute("data-mansa", "1");
    document.body.appendChild(s);
  }, [token]);

  const copy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">Powered by 1325.AI — Search Widget</h1>
          <p className="text-muted-foreground text-lg">
            Give any directory site a smart Black-business search box in 2 lines of code.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">1. Enter your partner token</h2>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your embed_token here to preview"
          />
          <p className="text-sm text-muted-foreground">
            Partners get their unique token from the 1325.AI team. Each token tracks searches, clicks, and referrals for that partner.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">2. Copy this embed code</h2>
            <Button onClick={copy} variant="outline" size="sm">
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            Paste anywhere in the partner site's HTML — no framework required. Works on WordPress, Squarespace, Wix, custom sites.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">3. Live preview</h2>
          {token ? (
            <div ref={mountRef} className="border rounded-lg p-6 bg-slate-50" />
          ) : (
            <div className="border rounded-lg p-12 bg-slate-50 text-center text-muted-foreground">
              Enter a partner token above to see the widget in action.
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-3 bg-primary/5 border-primary/20">
          <h3 className="font-semibold">What partners get</h3>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>AI-powered Black-business search on their site — instantly</li>
            <li>Zero maintenance — we handle the data, updates, and infrastructure</li>
            <li>Their brand stays on top; ours is the small "Powered by" badge</li>
            <li>Monthly dashboard: searches, clicks, top queries, referred users</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
