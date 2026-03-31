import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  CreditCard, TrendingUp, FileCheck, Shield, AlertTriangle,
  CheckCircle2, Clock, DollarSign, Loader2, RefreshCw, ChevronRight
} from 'lucide-react';

interface CreditReport {
  id: string;
  overall_score: number;
  financial_health_score: number;
  documentation_score: number;
  credit_profile_score: number;
  monthly_revenue: number;
  monthly_expenses: number;
  debt_to_income_ratio: number;
  profit_margin: number;
  months_in_business: number;
  executive_summary: string;
  strengths: Array<{ title: string; detail: string }>;
  weaknesses: Array<{ title: string; detail: string; fix: string }>;
  recommendations: Array<{ action: string; priority: string; timeline: string }>;
  loan_types_qualified: Array<{ type: string; likelihood: string; notes?: string }>;
  estimated_borrowing_range: { min: number; max: number; confidence: string };
  status: string;
  created_at: string;
  documents_included: Array<{ id: string; type: string; name: string }>;
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};

const scoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-500/10 border-green-500/20';
  if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-red-500/10 border-red-500/20';
};

const likelihoodColor = (l: string) => {
  if (l === 'strong') return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (l === 'moderate') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

const priorityIcon = (p: string) => {
  if (p === 'high') return <AlertTriangle className="h-3.5 w-3.5 text-red-400" />;
  if (p === 'medium') return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
  return <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />;
};

const KaylaCreditReadiness: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<CreditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchBusiness = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();
      if (data) {
        setBusinessId(data.id);
        fetchLatestReport(data.id);
      }
    };
    fetchBusiness();
  }, [user]);

  const fetchLatestReport = async (bId: string) => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('kayla-credit-readiness', {
        body: { business_id: bId, action: 'get_reports' },
      });
      if (data?.reports?.length) {
        setReport(data.reports[0]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!businessId) {
      toast.error('No business found for your account');
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-credit-readiness', {
        body: { business_id: businessId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport({ ...data, status: 'complete' } as CreditReport);
      toast.success('Credit Readiness Report generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!report || report.status !== 'complete') {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Credit & Lending Readiness</CardTitle>
          <CardDescription className="max-w-lg mx-auto">
            Kayla analyzes your financial data, documents, and business signals to generate a
            lender-ready package — organizing everything a bank needs to approve your loan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground w-full max-w-md">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Cash flow analysis</div>
            <div className="flex items-center gap-2"><FileCheck className="h-4 w-4 text-primary" /> Doc completeness</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Loan qualification</div>
          </div>
          <Button size="lg" onClick={generateReport} disabled={generating || !businessId} className="mt-2">
            {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating Package...</> : 'Generate Lender-Ready Package'}
          </Button>
          {!businessId && <p className="text-sm text-muted-foreground">You need to register a business first.</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit Readiness Report
            </CardTitle>
            <CardDescription>
              Generated {new Date(report.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={generateReport} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-1.5">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Overall Score', score: report.overall_score, icon: TrendingUp },
              { label: 'Financial Health', score: report.financial_health_score, icon: DollarSign },
              { label: 'Documentation', score: report.documentation_score, icon: FileCheck },
              { label: 'Credit Profile', score: report.credit_profile_score, icon: Shield },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg border p-4 ${scoreBg(item.score)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`h-4 w-4 ${scoreColor(item.score)}`} />
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                </div>
                <p className={`text-3xl font-bold ${scoreColor(item.score)}`}>{item.score}</p>
                <Progress value={item.score} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estimated Borrowing Range */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estimated Borrowing Range</p>
              <p className="text-2xl font-bold text-primary">
                {fmt(report.estimated_borrowing_range.min)} – {fmt(report.estimated_borrowing_range.max)}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Confidence: {report.estimated_borrowing_range.confidence}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1.5">
          <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          <TabsTrigger value="loans" className="text-xs">Loan Types</TabsTrigger>
          <TabsTrigger value="strengths" className="text-xs">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses" className="text-xs">Gaps</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Action Plan</TabsTrigger>
          <TabsTrigger value="financials" className="text-xs">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader><CardTitle className="text-base">Executive Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{report.executive_summary}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader><CardTitle className="text-base">Loan Types You May Qualify For</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.loan_types_qualified?.map((loan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{loan.type}</p>
                        {loan.notes && <p className="text-xs text-muted-foreground mt-0.5">{loan.notes}</p>}
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${likelihoodColor(loan.likelihood)}`}>
                      {loan.likelihood}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <Card>
            <CardHeader><CardTitle className="text-base">Strengths</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.strengths?.map((s, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weaknesses">
          <Card>
            <CardHeader><CardTitle className="text-base">Gaps to Address</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.weaknesses?.map((w, i) => (
                  <div key={i} className="p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{w.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{w.detail}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="font-medium">Fix: {w.fix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader><CardTitle className="text-base">Recommended Action Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.recommendations?.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    {priorityIcon(r.priority)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{r.action}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px]">{r.priority} priority</Badge>
                        <span className="text-[10px] text-muted-foreground">{r.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader><CardTitle className="text-base">Financial Snapshot</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Monthly Revenue', value: fmt(report.monthly_revenue) },
                  { label: 'Monthly Expenses', value: fmt(report.monthly_expenses) },
                  { label: 'Profit Margin', value: `${report.profit_margin?.toFixed(1)}%` },
                  { label: 'Debt-to-Income', value: `${report.debt_to_income_ratio?.toFixed(1)}%` },
                  { label: 'Months in Business', value: report.months_in_business?.toString() },
                  { label: 'Docs in Vault', value: report.documents_included?.length?.toString() || '0' },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg border bg-card">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KaylaCreditReadiness;
