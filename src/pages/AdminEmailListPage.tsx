import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Download, Mail, Search, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
  email: string;
  full_name: string;
  user_type: string;
  created_at: string;
  subscription_status: string;
}

export default function AdminEmailListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Email form state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  useEffect(() => {
    checkAdminAccess();
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, userTypeFilter, searchQuery]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: role, error } = await supabase
      .rpc('get_user_role', { user_id_param: user.id });

    if (error || role !== 'admin') {
      toast.error('Access denied: Admin only');
      navigate('/');
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, user_type, created_at, subscription_status')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = profiles;

    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.user_type === userTypeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.email.toLowerCase().includes(query) ||
        p.full_name?.toLowerCase().includes(query)
      );
    }

    setFilteredProfiles(filtered);
    setSelectedEmails(filtered.map(p => p.email));
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Full Name', 'User Type', 'Subscription Status', 'Created At'];
    const rows = filteredProfiles.map(p => [
      p.email,
      p.full_name || '',
      p.user_type,
      p.subscription_status || '',
      new Date(p.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-list-${userTypeFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredProfiles.length} contacts to CSV`);
  };

  const sendBulkEmail = async () => {
    if (!emailSubject || !emailContent) {
      toast.error('Please fill in subject and content');
      return;
    }

    if (selectedEmails.length === 0) {
      toast.error('No recipients selected');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          recipients: selectedEmails,
          subject: emailSubject,
          content: emailContent
        }
      });

      if (error) throw error;

      toast.success(`Email sent to ${selectedEmails.length} recipients`);
      setEmailSubject('');
      setEmailContent('');
    } catch (error: any) {
      console.error('Error sending bulk email:', error);
      toast.error('Failed to send email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const stats = {
    total: profiles.length,
    business: profiles.filter(p => p.user_type === 'business').length,
    customer: profiles.filter(p => p.user_type === 'customer').length,
    sponsor: profiles.filter(p => p.user_type === 'sponsor').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email List Management</h1>
          <p className="text-muted-foreground">Export email lists and send announcements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.business}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customer}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sponsor}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email List Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Email List
              </CardTitle>
              <CardDescription>
                Filter and export user email lists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users ({profiles.length})</SelectItem>
                    <SelectItem value="business">Businesses ({stats.business})</SelectItem>
                    <SelectItem value="customer">Customers ({stats.customer})</SelectItem>
                    <SelectItem value="sponsor">Sponsors ({stats.sponsor})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  {filteredProfiles.length} contacts selected
                </p>
                <Button onClick={exportToCSV} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Send Email Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Announcement
              </CardTitle>
              <CardDescription>
                Send email to {selectedEmails.length} selected users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Email content..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={8}
                />
              </div>

              <Button 
                onClick={sendBulkEmail} 
                disabled={sending || !emailSubject || !emailContent}
                className="w-full"
              >
                {sending ? 'Sending...' : `Send to ${selectedEmails.length} Users`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview List */}
        <Card>
          <CardHeader>
            <CardTitle>Preview ({filteredProfiles.length} users)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProfiles.slice(0, 50).map((profile, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{profile.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.full_name || 'No name'} • {profile.user_type}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {filteredProfiles.length > 50 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ... and {filteredProfiles.length - 50} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
