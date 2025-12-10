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
      <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-400/15 to-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Email List Management</h1>
            <p className="text-slate-400">Export email lists and send announcements</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <p className="text-sm font-medium text-amber-400">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <p className="text-sm font-medium text-amber-400">Businesses</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.business}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <p className="text-sm font-medium text-amber-400">Customers</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.customer}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <p className="text-sm font-medium text-amber-400">Sponsors</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.sponsor}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email List Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Users className="h-5 w-5 text-amber-400" />
                  Email List
                </h2>
                <p className="text-sm text-slate-400 mt-1">Filter and export user email lists</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">User Type</Label>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">All Users ({profiles.length})</SelectItem>
                      <SelectItem value="business" className="text-white hover:bg-white/10">Businesses ({stats.business})</SelectItem>
                      <SelectItem value="customer" className="text-white hover:bg-white/10">Customers ({stats.customer})</SelectItem>
                      <SelectItem value="sponsor" className="text-white hover:bg-white/10">Sponsors ({stats.sponsor})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-400 mb-3">
                    {filteredProfiles.length} contacts selected
                  </p>
                  <Button onClick={exportToCSV} className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30">
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Send Email Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Mail className="h-5 w-5 text-amber-400" />
                  Send Announcement
                </h2>
                <p className="text-sm text-slate-400 mt-1">Send email to {selectedEmails.length} selected users</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Subject</Label>
                  <Input
                    placeholder="Email subject..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Content</Label>
                  <Textarea
                    placeholder="Email content..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={8}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button 
                  onClick={sendBulkEmail} 
                  disabled={sending || !emailSubject || !emailContent}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : `Send to ${selectedEmails.length} Users`}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview List */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Preview ({filteredProfiles.length} users)</h2>
            </div>
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredProfiles.slice(0, 50).map((profile, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{profile.email}</p>
                      <p className="text-sm text-slate-400">
                        {profile.full_name || 'No name'} • {profile.user_type}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {filteredProfiles.length > 50 && (
                  <p className="text-sm text-slate-400 text-center py-2">
                    ... and {filteredProfiles.length - 50} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
