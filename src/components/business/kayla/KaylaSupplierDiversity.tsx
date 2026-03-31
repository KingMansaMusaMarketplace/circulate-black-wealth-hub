import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, Search, FileCheck, DollarSign, AlertTriangle, 
  ExternalLink, BookmarkPlus, Bookmark, RefreshCw, Award,
  CheckCircle2, Clock, XCircle, Loader2, TrendingUp, Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface KaylaSupplierDiversityProps {
  businessId: string;
}

const KaylaSupplierDiversity: React.FC<KaylaSupplierDiversityProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [findingOpps, setFindingOpps] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('kayla-supplier-diversity', {
        body: { action: 'get_dashboard', business_id: businessId },
      });
      if (error) throw error;
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load diversity dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId && user) fetchDashboard();
  }, [businessId, user]);

  const scanCertifications = async () => {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-supplier-diversity', {
        body: { action: 'scan_certifications', business_id: businessId },
      });
      if (error) throw error;
      toast.success(`Found ${data.certifications_recommended} certification opportunities`);
      fetchDashboard();
    } catch {
      toast.error('Failed to scan certifications');
    } finally {
      setScanning(false);
    }
  };

  const findOpportunities = async () => {
    setFindingOpps(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-supplier-diversity', {
        body: { action: 'find_opportunities', business_id: businessId },
      });
      if (error) throw error;
      toast.success(`Found ${data.opportunities_found} contract opportunities`);
      fetchDashboard();
    } catch {
      toast.error('Failed to find opportunities');
    } finally {
      setFindingOpps(false);
    }
  };

  const toggleBookmark = async (oppId: string, current: boolean) => {
    await supabase
      .from('supplier_diversity_opportunities')
      .update({ is_bookmarked: !current })
      .eq('id', oppId);
    fetchDashboard();
  };

  const updateCertStatus = async (certId: string, status: string) => {
    await supabase
      .from('supplier_diversity_certifications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', certId);
    toast.success('Certification status updated');
    fetchDashboard();
  };

  const certStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': case 'submitted': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const stats = dashboard?.stats || {};
  const readiness = dashboard?.readiness_score || 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{readiness}%</div>
            <p className="text-xs text-muted-foreground mt-1">Readiness Score</p>
            <Progress value={readiness} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{stats.active_certifications || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active Certs</p>
            <p className="text-xs text-muted-foreground">of {stats.total_certifications || 0} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.awarded_contracts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Contracts Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(stats.pipeline_value || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pipeline Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={scanCertifications} disabled={scanning} variant="outline">
          {scanning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
          Scan Certifications
        </Button>
        <Button onClick={findOpportunities} disabled={findingOpps}>
          {findingOpps ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Find Contracts
        </Button>
        <Button variant="ghost" onClick={fetchDashboard}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications" className="text-xs">
            <FileCheck className="h-3 w-3 mr-1" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="text-xs">
            <DollarSign className="h-3 w-3 mr-1" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {(dashboard?.certifications || []).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Shield className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No certifications tracked yet.</p>
                    <p className="text-sm mt-1">Click "Scan Certifications" to discover what you qualify for.</p>
                  </CardContent>
                </Card>
              ) : (
                (dashboard.certifications || []).map((cert: any) => (
                  <Card key={cert.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {certStatusIcon(cert.status)}
                            <h4 className="font-semibold text-sm truncate">{cert.certification_name}</h4>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {cert.certification_type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{cert.issuing_agency}</p>
                          {cert.ai_notes && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{cert.ai_notes}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>Readiness: {cert.ai_readiness_score}%</span>
                            </div>
                            {cert.expiration_date && (
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Clock className="h-3 w-3" />
                                <span>Expires: {new Date(cert.expiration_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {cert.application_url && (
                            <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                              <a href={cert.application_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Apply
                              </a>
                            </Button>
                          )}
                          {cert.status === 'not_started' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="text-xs h-7"
                              onClick={() => updateCertStatus(cert.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {cert.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="text-xs h-7"
                              onClick={() => updateCertStatus(cert.id, 'submitted')}
                            >
                              Mark Submitted
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {(dashboard?.opportunities || []).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No opportunities found yet.</p>
                    <p className="text-sm mt-1">Click "Find Contracts" to search for matching opportunities.</p>
                  </CardContent>
                </Card>
              ) : (
                (dashboard.opportunities || []).map((opp: any) => (
                  <Card key={opp.id} className={`hover:shadow-md transition-shadow ${opp.is_bookmarked ? 'ring-1 ring-primary/30' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{opp.title}</h4>
                            <Badge
                              variant={opp.contract_type === 'federal' ? 'default' : 'secondary'}
                              className="text-[10px] shrink-0"
                            >
                              {opp.contract_type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{opp.agency_name}</p>
                          {opp.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{opp.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs flex-wrap">
                            {(opp.estimated_value_min || opp.estimated_value_max) && (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="h-3 w-3" />
                                {opp.estimated_value_min && opp.estimated_value_max
                                  ? `${formatCurrency(opp.estimated_value_min)} - ${formatCurrency(opp.estimated_value_max)}`
                                  : formatCurrency(opp.estimated_value_max || opp.estimated_value_min)}
                              </div>
                            )}
                            {opp.deadline && (
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Clock className="h-3 w-3" />
                                {new Date(opp.deadline).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Match: {opp.match_score}%
                            </div>
                            {opp.set_aside_type && (
                              <Badge variant="outline" className="text-[10px]">
                                {opp.set_aside_type.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => toggleBookmark(opp.id, opp.is_bookmarked)}
                          >
                            {opp.is_bookmarked
                              ? <Bookmark className="h-4 w-4 fill-primary text-primary" />
                              : <BookmarkPlus className="h-4 w-4" />}
                          </Button>
                          {opp.source_url && (
                            <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                              <a href={opp.source_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <ScrollArea className="h-[500px]">
            {(dashboard?.compliance || []).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No compliance programs tracked.</p>
                  <p className="text-sm mt-1">As you win contracts, compliance tracking will activate automatically.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {(dashboard.compliance || []).map((comp: any) => (
                  <Card key={comp.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{comp.program_name}</h4>
                        <Badge variant={
                          comp.compliance_status === 'exceeding' ? 'default' :
                          comp.compliance_status === 'on_track' ? 'secondary' :
                          'destructive'
                        }>
                          {comp.compliance_status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{comp.sponsor_organization}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span>Spend: {formatCurrency(comp.spend_to_date || 0)} / {formatCurrency(comp.total_contract_value || 0)}</span>
                        {comp.next_report_due && (
                          <span className="text-yellow-600">Report due: {new Date(comp.next_report_due).toLocaleDateString()}</span>
                        )}
                      </div>
                      {comp.total_contract_value > 0 && (
                        <Progress
                          value={(comp.spend_to_date / comp.total_contract_value) * 100}
                          className="mt-2 h-1.5"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KaylaSupplierDiversity;
