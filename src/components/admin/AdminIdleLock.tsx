import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

/**
 * AdminIdleLock
 * Watches for user activity across the admin dashboard. After 15 minutes of
 * true idleness (no mouse, keyboard, or touch), it drops a full-screen overlay
 * that requires the current admin's password before the dashboard is usable
 * again. Session is NOT signed out — this is a local re-verification only.
 */
const IDLE_MS = 15 * 60 * 1000; // 15 minutes

export function AdminIdleLock() {
  const { user } = useAuth();
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const interval = setInterval(() => {
      if (!locked && Date.now() - lastActivityRef.current > IDLE_MS) {
        setLocked(true);
      }
    }, 15_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(interval);
    };
  }, [locked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !password) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });
      if (error) {
        toast.error("Wrong password");
        setSubmitting(false);
        return;
      }
      lastActivityRef.current = Date.now();
      setPassword("");
      setLocked(false);
      toast.success("Welcome back");
    } catch {
      toast.error("Couldn't verify — try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleUnlock}
        className="w-full max-w-md rounded-2xl border border-mansagold/40 bg-gradient-to-br from-slate-900 to-black p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-mansagold/20 border border-mansagold/40 flex items-center justify-center mb-4">
            <Lock className="h-7 w-7 text-mansagold" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Admin locked</h2>
          <p className="text-blue-200 text-sm">
            You've been idle for 15 minutes. Enter your password to keep working.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="idle-email" className="text-blue-300 text-xs">
              Signed in as
            </Label>
            <div
              id="idle-email"
              className="mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
            >
              {user?.email || "unknown"}
            </div>
          </div>
          <div>
            <Label htmlFor="idle-password" className="text-blue-300 text-xs">
              Password
            </Label>
            <Input
              id="idle-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting || !password}
          className="w-full mt-6 bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
        >
          {submitting ? "Verifying…" : "Unlock dashboard"}
        </Button>

        <p className="text-xs text-blue-300/70 text-center mt-4 flex items-center justify-center gap-1">
          <ShieldAlert className="h-3 w-3" />
          Your session stays alive — this is a local safety check.
        </p>
      </form>
    </div>
  );
}
