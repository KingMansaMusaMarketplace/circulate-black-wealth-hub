import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import { PROPERTY_TYPES } from "@/lib/lease/property-types";

const MAX_ROWS = 100;
const VALID_TYPES = PROPERTY_TYPES.map(p => p.value);

const HEADERS = [
  "title", "description", "property_type", "address", "city", "state", "zip_code",
  "bedrooms", "bathrooms", "max_guests", "monthly_rent", "security_deposit_amount",
  "lease_term_months", "available_from", "utilities_included",
  "pets_allowed", "pet_deposit", "section_8_accepted", "furnished",
  "min_credit_score", "min_income_multiplier",
];

const EXAMPLE_ROW = [
  "Sunny 2BR in Bronzeville", "Renovated unit near the Green Line. Hardwood floors, in-unit laundry.",
  "apartment", "4321 S King Dr", "Chicago", "IL", "60653",
  "2", "1", "4", "1850", "1850",
  "12", "2026-07-01", "water|trash",
  "true", "0", "false", "false",
  "650", "3",
];

interface ParsedRow {
  rowNum: number;
  raw: Record<string, string>;
  errors: string[];
  data?: any;
}

const toBool = (v: string) => /^(true|yes|y|1)$/i.test((v || "").trim());

const HostBulkUploadLeasesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [fairHousingAck, setFairHousingAck] = useState(false);
  const [noBrokerAck, setNoBrokerAck] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; failed: number } | null>(null);

  const validCount = useMemo(() => rows.filter(r => r.errors.length === 0).length, [rows]);
  const errorCount = rows.length - validCount;

  const downloadTemplate = () => {
    const csv = Papa.unparse({ fields: HEADERS, data: [EXAMPLE_ROW] });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mansa-stays-lease-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateRow = (raw: Record<string, string>, rowNum: number): ParsedRow => {
    const errs: string[] = [];
    const get = (k: string) => (raw[k] || "").trim();

    if (!get("title")) errs.push("Title is required");
    if (!get("city")) errs.push("City is required");
    if (!get("state")) errs.push("State is required");

    const pt = get("property_type").toLowerCase();
    if (!VALID_TYPES.includes(pt as any)) errs.push(`property_type must be one of: ${VALID_TYPES.join(", ")}`);

    const rent = Number(get("monthly_rent"));
    if (!rent || rent <= 0) errs.push("monthly_rent must be > 0");

    const beds = Number(get("bedrooms") || 1);
    const baths = Number(get("bathrooms") || 1);
    if (isNaN(beds) || beds < 0) errs.push("bedrooms must be a number");
    if (isNaN(baths) || baths < 0) errs.push("bathrooms must be a number");

    const data = errs.length === 0 ? {
      title: get("title"),
      description: get("description"),
      property_type: pt,
      address: get("address") || get("city"),
      city: get("city"),
      state: get("state"),
      zip_code: get("zip_code") || null,
      country: "USA",
      bedrooms: beds,
      bathrooms: baths,
      max_guests: Number(get("max_guests")) || beds * 2 || 2,
      monthly_rent: rent,
      security_deposit_amount: Number(get("security_deposit_amount")) || null,
      lease_term_months: Number(get("lease_term_months")) || 12,
      available_from: get("available_from") || null,
      utilities_included: get("utilities_included")
        ? get("utilities_included").split(/[|,]/).map(s => s.trim()).filter(Boolean)
        : [],
      pets_allowed: toBool(get("pets_allowed")),
      pet_deposit: Number(get("pet_deposit")) || 0,
      section_8_accepted: toBool(get("section_8_accepted")),
      furnished: toBool(get("furnished")),
      min_credit_score: get("min_credit_score") ? Number(get("min_credit_score")) : null,
      min_income_multiplier: Number(get("min_income_multiplier")) || 3,
      base_nightly_rate: 0,
      listing_mode: "yearly_lease",
      is_active: true,
      amenities: [],
      photos: [],
    } : undefined;

    return { rowNum, raw, errors: errs, data };
  };

  const handleFile = (file: File) => {
    setResult(null);
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        if (data.length === 0) {
          toast.error("CSV is empty");
          setRows([]);
          return;
        }
        if (data.length > MAX_ROWS) {
          toast.error(`Max ${MAX_ROWS} rows per upload. Your file has ${data.length}.`);
          setRows([]);
          return;
        }
        const parsed = data.map((row, i) => validateRow(row, i + 2));
        setRows(parsed);
        toast.success(`Parsed ${parsed.length} rows`);
      },
      error: (err) => {
        toast.error(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const downloadErrorReport = () => {
    const errored = rows.filter(r => r.errors.length > 0);
    const csv = Papa.unparse({
      fields: ["row", "errors", ...HEADERS],
      data: errored.map(r => [r.rowNum, r.errors.join("; "), ...HEADERS.map(h => r.raw[h] || "")]),
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lease-upload-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    if (!user) { toast.error("Sign in to upload listings"); return; }
    if (!fairHousingAck || !noBrokerAck) { toast.error("Please acknowledge both legal statements"); return; }
    const valid = rows.filter(r => r.errors.length === 0);
    if (valid.length === 0) { toast.error("No valid rows to import"); return; }

    setImporting(true);
    const payload = valid.map(r => ({ ...r.data, host_id: user.id }));
    const { data, error } = await supabase.from("vacation_properties").insert(payload).select("id");
    setImporting(false);

    if (error) {
      toast.error(`Import failed: ${error.message}`);
      return;
    }
    const imported = data?.length || 0;
    setResult({ imported, failed: rows.length - imported });
    toast.success(`${imported} listings imported`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Bulk upload lease listings — Mansa Stays</title>
      </Helmet>
      <section className="max-w-5xl mx-auto p-4 md:p-10">
        <Button asChild variant="ghost" className="text-white/80 hover:text-white mb-4">
          <Link to="/stays/host/lease/dashboard"><ArrowLeft className="w-4 h-4 mr-2" />Back to dashboard</Link>
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold">Bulk upload lease listings</h1>
        <p className="text-white/80 mt-2">Upload up to {MAX_ROWS} listings at once via CSV. Free to list — $99 success fee only on confirmed leases.</p>

        <Card className="bg-white/10 border-white/20 p-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Step 1 — Download the template</h2>
              <p className="text-white/70 text-sm">Includes all column headers and one example row.</p>
            </div>
            <Button onClick={downloadTemplate} className="bg-mansagold text-black hover:bg-mansagold/90">
              <Download className="w-4 h-4 mr-2" />Download CSV template
            </Button>
          </div>
        </Card>

        <Card className="bg-white/10 border-white/20 p-6 mt-4">
          <h2 className="text-lg font-semibold">Step 2 — Upload your file</h2>
          <p className="text-white/70 text-sm mb-3">Max {MAX_ROWS} rows. Photos can be added per-listing after import.</p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg p-8 cursor-pointer hover:border-mansagold transition-colors">
            <Upload className="w-10 h-10 text-white/60 mb-2" />
            <span className="text-white/90 font-medium">{fileName || "Click to choose a CSV file"}</span>
            <span className="text-white/60 text-xs mt-1">or drag and drop</span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </Card>

        {rows.length > 0 && !result && (
          <Card className="bg-white/10 border-white/20 p-6 mt-4">
            <h2 className="text-lg font-semibold mb-3">Step 3 — Review</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className="bg-green-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />{validCount} valid</Badge>
              {errorCount > 0 && (
                <>
                  <Badge className="bg-red-600 text-white"><AlertCircle className="w-3 h-3 mr-1" />{errorCount} with errors</Badge>
                  <Button size="sm" variant="outline" onClick={downloadErrorReport} className="border-white/30 text-white hover:bg-white/10">
                    <Download className="w-3 h-3 mr-1" />Download error report
                  </Button>
                </>
              )}
            </div>

            <div className="max-h-96 overflow-auto border border-white/20 rounded">
              <table className="w-full text-sm">
                <thead className="bg-white/10 sticky top-0">
                  <tr className="text-left">
                    <th className="p-2">Row</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">City</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Rent</th>
                    <th className="p-2">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.rowNum} className={r.errors.length > 0 ? "bg-red-500/10" : "bg-green-500/5"}>
                      <td className="p-2 text-white/70">{r.rowNum}</td>
                      <td className="p-2">{r.errors.length === 0 ? "✓" : "✗"}</td>
                      <td className="p-2 truncate max-w-[200px]">{r.raw.title}</td>
                      <td className="p-2">{r.raw.city}, {r.raw.state}</td>
                      <td className="p-2">{r.raw.property_type}</td>
                      <td className="p-2">${r.raw.monthly_rent}</td>
                      <td className="p-2 text-red-300 text-xs">{r.errors.join("; ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 border-t border-white/20 pt-4 mt-4">
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={fairHousingAck} onCheckedChange={(v) => setFairHousingAck(!!v)} className="mt-1" />
                <span>I will comply with the federal Fair Housing Act and all applicable state/local fair-housing laws for every listing in this upload.</span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={noBrokerAck} onCheckedChange={(v) => setNoBrokerAck(!!v)} className="mt-1" />
                <span>I confirm I am the property owner or authorized property manager. Mansa Stays is not acting as a real-estate broker.</span>
              </label>
            </div>

            <Button
              onClick={doImport}
              disabled={importing || validCount === 0 || !fairHousingAck || !noBrokerAck}
              className="mt-4 bg-mansagold text-black hover:bg-mansagold/90 w-full md:w-auto"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {importing ? "Importing..." : `Import ${validCount} listing${validCount === 1 ? "" : "s"}`}
            </Button>
          </Card>
        )}

        {result && (
          <Alert className="mt-4 bg-green-600/20 border-green-500/40 text-white">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>{result.imported} listings imported successfully.</strong>
              {result.failed > 0 && <> {result.failed} rows were skipped due to errors.</>}
              <div className="mt-3 flex gap-2 flex-wrap">
                <Button asChild size="sm" className="bg-mansagold text-black hover:bg-mansagold/90">
                  <Link to="/stays/host/lease/dashboard">Go to my listings</Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setRows([]); setResult(null); setFileName(""); }} className="border-white/30 text-white hover:bg-white/10">
                  Upload another file
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <LeaseLegalFooter />
      </section>
    </div>
  );
};

export default HostBulkUploadLeasesPage;
