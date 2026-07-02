import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, ArrowRight, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/analytics/funnel-tracker";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How would you grow my bakery on Instagram?",
  "What grants can a Black-owned salon apply for?",
  "Write a 30-second pitch for my landscaping business.",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi — I'm Kayla, your AI Business Manager. Ask me anything about growing or running your business. Try a sample below or type your own question.",
};

const KaylaDemoSection = () => {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const userTurnCount = next.filter((m) => m.role === "user").length;
    trackFunnelEvent("kayla_demo_message", { turn: userTurnCount });

    try {
      const { data, error: fnError } = await supabase.functions.invoke("kayla-public-demo", {
        body: { messages: next.filter((m) => m !== GREETING) },
      });

      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        return;
      }

      const reply: string = data?.reply || "Sorry — could you rephrase that?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // After 2 user turns, show the conversion CTA
      if (userTurnCount >= 2) setShowCta(true);
    } catch (err: any) {
      console.error("Kayla demo error", err);
      setError("Kayla is briefly unavailable. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-mansagold/10 border border-mansagold/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-mansagold" />
            <span className="text-mansagold text-sm font-semibold">Try Kayla Free — No Signup</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            Meet Kayla — Your{" "}
            <span className="bg-gradient-to-r from-mansagold to-amber-300 bg-clip-text text-transparent">
              AI Business Manager
            </span>
          </h2>
          <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto">
            Ask her anything. Then imagine her working on your business 24/7 — answering customers, booking appointments, and growing your brand.
          </p>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-mansablue/40 to-black/40 px-5 py-3 border-b border-white/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">Kayla, Ph.D.</p>
              <p className="text-emerald-400 text-xs flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="px-4 sm:px-6 py-5 max-h-[420px] overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === "user"
                      ? "bg-mansablue/40 border border-mansablue/60"
                      : "bg-mansagold/20 border border-mansagold/40"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4 text-blue-200" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-mansagold" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-mansablue/30 text-white border border-mansablue/40"
                      : "bg-slate-800/80 text-blue-50 border border-white/5"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-mansagold/20 border border-mansagold/40 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-mansagold animate-pulse" />
                </div>
                <div className="bg-slate-800/80 border border-white/5 rounded-2xl px-4 py-2.5 text-sm text-blue-200/70 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kayla is thinking…
                </div>
              </div>
            )}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs sm:text-sm bg-slate-800/70 hover:bg-slate-700/70 text-blue-100 border border-white/10 rounded-full px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="px-4 sm:px-6 py-4 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kayla anything about your business…"
              maxLength={500}
              disabled={loading}
              className="flex-1 bg-slate-800/70 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-blue-200/40 focus:outline-none focus:border-mansagold/60 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-mansagold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-4 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {showCta && (
          <div className="mt-6 bg-gradient-to-r from-mansagold/20 to-amber-500/10 border border-mansagold/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-bold text-lg">
                Want Kayla working for your business 24/7?
              </p>
              <p className="text-blue-100/80 text-sm">
                First 100 businesses lock in <span className="text-mansagold font-semibold">50% off forever</span>.
              </p>
            </div>
            <Link
              to="/business-signup"
              onClick={() =>
                trackFunnelEvent("kayla_demo_cta_click", { messages: messages.length })
              }
              className="inline-flex items-center gap-2 bg-mansagold hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Claim Your Founding Spot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default KaylaDemoSection;
