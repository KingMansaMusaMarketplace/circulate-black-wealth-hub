import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format, differenceInDays, addDays } from 'date-fns';
import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  FileText,
  Send,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  MessageSquare,
  Award,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SponsorCertificateGenerator } from '@/components/sponsors/SponsorCertificateGenerator';

const tierPrices = {
  platinum: 15000,
  gold: 5000,
  silver: 1500,
  bronze: 500,
};

interface Sponsor {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  tier: string;
  status: string;
  is_visible: boolean;
  logo_approved: boolean;
  display_priority: number;
  admin_notes: string | null;
  created_at: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

interface Communication {
  id: string;
  communication_type: string;
  subject: string | null;
  content: string;
  email_template: string | null;
  sent_at: string;
}

interface Reminder {
  id: string;
  reminder_type: string;
  reminder_date: string;
  message: string | null;
  is_completed: boolean;
}

// UUID validation regex
const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export default function AdminSponsorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if ID is valid UUID
  const isValidId = id && isValidUUID(id);
  
  const [editMode, setEditMode] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [sponsorSwitcherOpen, setSponsorSwitcherOpen] = useState(false);
  
  // Form states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('custom');
  const [reminderType, setReminderType] = useState('follow_up');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  
  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Sponsor>>({});

  const { data: sponsor, isLoading } = useQuery({
    queryKey: ['admin-sponsor-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Sponsor;
    },
    enabled: isValidId && userRole === 'admin',
  });

  // Fetch all sponsors for quick-switcher
  const { data: allSponsors } = useQuery({
    queryKey: ['admin-sponsors-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('id, company_name, tier, status, logo_url')
        .order('company_name', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin',
  });

  const { data: metrics } = useQuery({
    queryKey: ['sponsor-metrics', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: isValidId && userRole === 'admin',
  });

  const { data: communications } = useQuery({
    queryKey: ['sponsor-communications', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_communications')
        .select('*')
        .eq('sponsor_id', id)
        .order('sent_at', { ascending: false });
      if (error) throw error;
      return data as Communication[];
    },
    enabled: isValidId && userRole === 'admin',
  });

  const { data: reminders } = useQuery({
    queryKey: ['sponsor-reminders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_reminders')
        .select('*')
        .eq('sponsor_id', id)
        .order('reminder_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: isValidId && userRole === 'admin',
  });

  const { data: auditLog } = useQuery({
    queryKey: ['sponsor-audit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_admin_audit')
        .select('*')
        .eq('sponsor_id', id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: isValidId && userRole === 'admin',
  });

  const updateSponsorMutation = useMutation({
    mutationFn: async (updates: Partial<Sponsor>) => {
      const { error } = await supabase
        .from('corporate_subscriptions')
        .update(updates)
        .eq('id', id);
      if (error) throw error;

      await supabase.from('sponsor_admin_audit').insert({
        admin_user_id: user?.id,
        sponsor_id: id,
        action: 'profile_update',
        new_value: updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sponsor-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-sponsors'] });
      toast.success('Sponsor updated successfully');
      setEditMode(false);
    },
    onError: () => toast.error('Failed to update sponsor'),
  });

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      // Log the communication
      const { error } = await supabase.from('sponsor_communications').insert({
        sponsor_id: id,
        admin_user_id: user?.id,
        communication_type: 'email',
        subject: emailSubject,
        content: emailContent,
        email_template: emailTemplate,
      });
      if (error) throw error;

      // Send actual email via edge function
      const { error: sendError } = await supabase.functions.invoke('send-sponsor-email', {
        body: {
          sponsorId: id,
          subject: emailSubject,
          content: emailContent,
          template: emailTemplate,
        },
      });
      if (sendError) throw sendError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-communications', id] });
      toast.success('Email sent successfully');
      setEmailDialogOpen(false);
      setEmailSubject('');
      setEmailContent('');
    },
    onError: () => toast.error('Failed to send email'),
  });

  const createReminderMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('sponsor_reminders').insert({
        sponsor_id: id,
        reminder_type: reminderType,
        reminder_date: reminderDate,
        message: reminderMessage,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-reminders', id] });
      toast.success('Reminder created');
      setReminderDialogOpen(false);
      setReminderDate('');
      setReminderMessage('');
    },
    onError: () => toast.error('Failed to create reminder'),
  });

  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from('sponsor_reminders')
        .update({ is_completed: true, completed_at: new Date().toISOString(), completed_by: user?.id })
        .eq('id', reminderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-reminders', id] });
      toast.success('Reminder completed');
    },
  });

  // Wait for auth to load before checking role
  if (!user && userRole === null) {
    return (
      <DashboardLayout title="Sponsor Details" icon={<Building2 className="h-6 w-6" />}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Sponsor Details" icon={<Building2 className="h-6 w-6" />}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isValidId || !sponsor) {
    return (
      <DashboardLayout title="Sponsor Details" icon={<Building2 className="h-6 w-6" />}>
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {!isValidId ? 'Invalid sponsor ID. Please select a sponsor from the list.' : 'Sponsor not found'}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/sponsors')}>
            Back to Sponsors
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const totalImpressions = metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
  const totalClicks = metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const daysUntilRenewal = sponsor.current_period_end
    ? differenceInDays(new Date(sponsor.current_period_end), new Date())
    : null;

  const emailTemplates: Record<string, { subject: string; content: string }> = {
    renewal: {
      subject: `Your ${sponsor.tier.toUpperCase()} sponsorship is up for renewal`,
      content: `Dear ${sponsor.contact_name || sponsor.company_name},\n\nYour sponsorship is expiring soon. We would love to continue our partnership. Please let us know if you'd like to renew.\n\nBest regards,\nMansa Musa Marketplace Team`,
    },
    logo_reminder: {
      subject: 'Action Required: Upload Your Company Logo',
      content: `Dear ${sponsor.contact_name || sponsor.company_name},\n\nWe noticed you haven't uploaded your company logo yet. Your logo helps increase brand visibility across our platform.\n\nPlease upload your logo through your sponsor dashboard.\n\nBest regards,\nMansa Musa Marketplace Team`,
    },
    welcome: {
      subject: `Welcome to Mansa Musa Marketplace - ${sponsor.tier.toUpperCase()} Sponsor`,
      content: `Dear ${sponsor.contact_name || sponsor.company_name},\n\nWelcome to Mansa Musa Marketplace! We're thrilled to have you as a ${sponsor.tier} sponsor.\n\nYour sponsorship helps support Black-owned businesses in our community.\n\nBest regards,\nMansa Musa Marketplace Team`,
    },
  };

  const handleTemplateChange = (template: string) => {
    setEmailTemplate(template);
    if (template !== 'custom' && emailTemplates[template]) {
      setEmailSubject(emailTemplates[template].subject);
      setEmailContent(emailTemplates[template].content);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'past_due': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500/10 text-purple-500';
      case 'gold': return 'bg-yellow-500/10 text-yellow-500';
      case 'silver': return 'bg-zinc-500/10 text-zinc-400';
      case 'bronze': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout title={sponsor.company_name} icon={<Building2 className="h-6 w-6" />}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/sponsors')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {sponsor.logo_url ? (
              <img src={sponsor.logo_url} alt={sponsor.company_name} className="h-12 w-12 rounded object-contain bg-background border" />
            ) : (
              <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              {/* Sponsor Quick Switcher */}
              <Popover open={sponsorSwitcherOpen} onOpenChange={setSponsorSwitcherOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={sponsorSwitcherOpen}
                    className="h-auto p-1 -ml-1 text-2xl font-bold hover:bg-muted/50"
                  >
                    {sponsor.company_name}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search sponsors..." />
                    <CommandList>
                      <CommandEmpty>No sponsor found.</CommandEmpty>
                      <CommandGroup heading="Sponsors">
                        {allSponsors?.map((s) => (
                          <CommandItem
                            key={s.id}
                            value={s.company_name}
                            onSelect={() => {
                              navigate(`/admin/sponsors/${s.id}`);
                              setSponsorSwitcherOpen(false);
                            }}
                            className="flex items-center gap-2"
                          >
                            {s.logo_url ? (
                              <img src={s.logo_url} alt="" className="h-6 w-6 rounded object-contain bg-background" />
                            ) : (
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            )}
                            <div className="flex-1 truncate">
                              <span className="font-medium">{s.company_name}</span>
                              <span className="ml-2 text-xs text-muted-foreground capitalize">{s.tier}</span>
                            </div>
                            {s.id === id && <Check className="h-4 w-4 text-primary" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getTierColor(sponsor.tier)}>{sponsor.tier.toUpperCase()}</Badge>
                <Badge className={getStatusColor(sponsor.status)}>{sponsor.status}</Badge>
                {daysUntilRenewal !== null && daysUntilRenewal <= 30 && (
                  <Badge className="bg-orange-500/10 text-orange-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {daysUntilRenewal} days left
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Generate Sponsorship Certificate</DialogTitle>
              </DialogHeader>
              <SponsorCertificateGenerator sponsor={sponsor} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Monthly Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tierPrices[sponsor.tier as keyof typeof tierPrices]?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="communications">Communications ({communications?.length || 0})</TabsTrigger>
          <TabsTrigger value="reminders">Reminders ({reminders?.filter(r => !r.is_completed).length || 0})</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        defaultValue={sponsor.company_name}
                        onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input
                        defaultValue={sponsor.website_url || ''}
                        onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input
                        defaultValue={sponsor.logo_url || ''}
                        onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
                      />
                    </div>
                    <Button onClick={() => updateSponsorMutation.mutate(editForm)}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {sponsor.website_url ? (
                        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {sponsor.website_url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No website</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Member since {format(new Date(sponsor.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    {sponsor.current_period_end && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Renews {format(new Date(sponsor.current_period_end), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label>Contact Name</Label>
                      <Input
                        defaultValue={sponsor.contact_name || ''}
                        onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input
                        defaultValue={sponsor.contact_email || ''}
                        onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input
                        defaultValue={sponsor.contact_phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{sponsor.contact_name || 'No contact name'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {sponsor.contact_email ? (
                        <a href={`mailto:${sponsor.contact_email}`} className="text-primary hover:underline">
                          {sponsor.contact_email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No email</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{sponsor.contact_phone || 'No phone'}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibility Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Visible on Site</Label>
                  <Switch
                    checked={sponsor.is_visible}
                    onCheckedChange={(checked) => updateSponsorMutation.mutate({ is_visible: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Logo Approved</Label>
                  <Switch
                    checked={sponsor.logo_approved}
                    onCheckedChange={(checked) => updateSponsorMutation.mutate({ logo_approved: checked })}
                    disabled={!sponsor.logo_url}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Priority</Label>
                  <Input
                    type="number"
                    defaultValue={sponsor.display_priority}
                    onChange={(e) => updateSponsorMutation.mutate({ display_priority: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">Higher numbers appear first</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  defaultValue={sponsor.admin_notes || ''}
                  placeholder="Internal notes about this sponsor..."
                  onBlur={(e) => {
                    if (e.target.value !== sponsor.admin_notes) {
                      updateSponsorMutation.mutate({ admin_notes: e.target.value });
                    }
                  }}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>Track all emails and contacts with this sponsor</CardDescription>
              </div>
              <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Email to {sponsor.company_name}</DialogTitle>
                    <DialogDescription>
                      Choose a template or write a custom message
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Template</Label>
                      <Select value={emailTemplate} onValueChange={handleTemplateChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom Message</SelectItem>
                          <SelectItem value="welcome">Welcome Email</SelectItem>
                          <SelectItem value="renewal">Renewal Reminder</SelectItem>
                          <SelectItem value="logo_reminder">Logo Upload Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button onClick={() => sendEmailMutation.mutate()} disabled={sendEmailMutation.isPending}>
                      {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {communications && communications.length > 0 ? (
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div key={comm.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{comm.subject || 'No subject'}</span>
                          {comm.email_template && (
                            <Badge variant="secondary">{comm.email_template}</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comm.sent_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{comm.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p>No communications yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reminders & Follow-ups</CardTitle>
                <CardDescription>Schedule tasks and follow-ups for this sponsor</CardDescription>
              </div>
              <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Reminder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={reminderType} onValueChange={setReminderType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow_up">Follow Up</SelectItem>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="logo_upload">Logo Upload</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea value={reminderMessage} onChange={(e) => setReminderMessage(e.target.value)} />
                    </div>
                    <Button onClick={() => createReminderMutation.mutate()}>Create Reminder</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {reminders && reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`border rounded-lg p-4 flex items-center justify-between ${
                        reminder.is_completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {reminder.is_completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{reminder.reminder_type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(reminder.reminder_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          {reminder.message && <p className="text-sm mt-1">{reminder.message}</p>}
                        </div>
                      </div>
                      {!reminder.is_completed && (
                        <Button variant="outline" size="sm" onClick={() => completeReminderMutation.mutate(reminder.id)}>
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No reminders set</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Track all admin actions for this sponsor</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLog && auditLog.length > 0 ? (
                <div className="space-y-2">
                  {auditLog.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{log.action}</span>
                        {log.new_value && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {JSON.stringify(log.new_value)}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No activity recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
