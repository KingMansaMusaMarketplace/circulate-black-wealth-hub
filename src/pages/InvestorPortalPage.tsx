import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, FileText, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "investor_portal_session_v1";

interface InvestorSession {
  token: string;
  name: string;
  email: string;
  firm: string;
}

export default function InvestorPortalPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<InvestorSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [ndaAcknowledged, setNdaAcknowledged] = useState(false);
  const [ndaDownloaded, setNdaDownloaded] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !passcode.trim()) {
      toast({
        title: "Missing information",
        description: "Name, email, and passcode are required.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-investor-passcode",
        {
          body: {
            name: name.trim(),
            email: email.trim(),
            firm: firm.trim(),
            passcode: passcode.trim(),
          },
        },
      );
      if (error || !data?.ok) {
        const msg = (data as { error?: string } | null)?.error ?? error?.message ?? "Access denied.";
        toast({ title: "Access denied", description: msg, variant: "destructive" });
        return;
      }
      const newSession: InvestorSession = {
        token: data.session,
        name: data.investor.name,
        email: data.investor.email,
        firm: data.investor.firm,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      toast({
        title: "Welcome",
        description: `Access granted. Please review the NDA first, ${newSession.name}.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Unable to verify access right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: "nda" | "manual") => {
    if (!session) return;
    if (doc === "manual" && !ndaAcknowledged) {
      toast({
        title: "NDA required",
        description: "Please acknowledge the NDA before accessing the manual.",
        variant: "destructive",
      });
      return;
    }
    setDownloadingDoc(doc);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-investor-document-url",
        {
          body: {
            session: session.token,
            document: doc,
            ndaAcknowledged,
          },
        },
      );
      if (error || !data?.url) {
        const msg = (data as { error?: string } | null)?.error ?? error?.message ?? "Document unavailable.";
        toast({ title: "Download failed", description: msg, variant: "destructive" });
        if (msg.toLowerCase().includes("session")) {
          sessionStorage.removeItem(SESSION_KEY);
          setSession(null);
        }
        return;
      }
      window.open(data.url, "_blank", "noopener");
      if (doc === "nda") setNdaDownloaded(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Unable to fetch document right now.",
        variant: "destructive",
      });
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setNdaAcknowledged(false);
    setNdaDownloaded(false);
    setName("");
    setEmail("");
    setFirm("");
    setPasscode("");
  };

  return (
    <>
      <Helmet>
        <title>1325.AI Investor Portal — Confidential</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Private 1325.AI investor portal. Access requires authorization."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-mansablue via-mansablue-dark to-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {!session ? (
            <Card className="border-mansagold/30 shadow-2xl">
              <CardHeader className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-full bg-mansagold/10 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-mansagold" />
                </div>
                <CardTitle className="text-2xl font-serif">
                  1325.AI Investor Portal
                </CardTitle>
                <CardDescription>
                  Confidential materials. Identity verification required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={120}
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firm">Firm</Label>
                      <Input
                        id="firm"
                        value={firm}
                        onChange={(e) => setFirm(e.target.value)}
                        maxLength={200}
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passcode">Access passcode *</Label>
                    <Input
                      id="passcode"
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      maxLength={120}
                      autoComplete="off"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Provided to you privately by Thomas D. Bowling.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Unlock investor materials
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-[11px] text-muted-foreground text-center mt-4">
                  All access attempts are logged. Materials reference USPTO Provisional 63/969,202.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-mansagold/30 shadow-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-serif flex items-center gap-2">
                        <Shield className="w-5 h-5 text-mansagold" />
                        Welcome, {session.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {session.firm ? `${session.firm} · ` : ""}
                        {session.email}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Step 1: NDA */}
              <Card
                className={`shadow-xl ${
                  ndaAcknowledged ? "border-green-500/40" : "border-mansagold/40"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ndaAcknowledged ? "bg-green-500/10" : "bg-mansagold/10"
                      }`}
                    >
                      {ndaAcknowledged ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-mansagold" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Step 1 — Mutual NDA (required first)
                      </CardTitle>
                      <CardDescription>
                        Review, download, and acknowledge before accessing the manual.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted/40 border p-4 text-sm space-y-2">
                    <p>
                      <strong>Mutual Non-Disclosure Agreement</strong> between Mansa Musa
                      Marketplace, Inc. ("Disclosing Party") and the recipient.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>3-year term, Illinois governing law</li>
                      <li>Covers all 1325.AI Platform Manual materials</li>
                      <li>References USPTO Provisional 63/969,202</li>
                    </ul>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload("nda")}
                    disabled={downloadingDoc === "nda"}
                  >
                    {downloadingDoc === "nda" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Preparing…
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download NDA (PDF)
                      </>
                    )}
                  </Button>
                  <div className="flex items-start gap-3 rounded-lg border bg-background p-4">
                    <Checkbox
                      id="ack"
                      checked={ndaAcknowledged}
                      onCheckedChange={(v) => setNdaAcknowledged(v === true)}
                      disabled={!ndaDownloaded}
                    />
                    <Label
                      htmlFor="ack"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I have downloaded and read the NDA, and I agree to its terms on
                      behalf of myself and {session.firm || "my firm"}. I understand the
                      v12 manual is confidential and watermarked for my eyes only.
                    </Label>
                  </div>
                  {!ndaDownloaded && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Download the NDA first to enable acknowledgment.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Manual */}
              <Card
                className={`shadow-xl ${
                  ndaAcknowledged ? "border-mansagold/40" : "border-muted opacity-70"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ndaAcknowledged ? "bg-mansagold/10" : "bg-muted"
                      }`}
                    >
                      {ndaAcknowledged ? (
                        <FileText className="w-5 h-5 text-mansagold" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Step 2 — Complete Platform Manual v12
                      </CardTitle>
                      <CardDescription>
                        46 pages · Watermarked · Confidential — Investor Grade
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Executive summary, market opportunity, agentic commerce protocol</li>
                    <li>$100M Series A pre-money valuation justification</li>
                    <li>Patent portfolio, unit economics, financial projections</li>
                  </ul>
                  <Button
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
                    onClick={() => handleDownload("manual")}
                    disabled={!ndaAcknowledged || downloadingDoc === "manual"}
                  >
                    {downloadingDoc === "manual" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Preparing secure download…
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download v12 Platform Manual (PDF)
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Each download generates a one-time signed link valid for 10 minutes.
                    Your access is recorded in our audit log.
                  </p>
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground">
                Questions? Contact Thomas D. Bowling — Founder, Chairman & CEO
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
