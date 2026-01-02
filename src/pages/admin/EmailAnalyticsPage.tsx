import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RefreshCw, Search, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmailStatsCards from '@/components/admin/email/EmailStatsCards';
import EmailEventsTable from '@/components/admin/email/EmailEventsTable';
import { fetchEmailEvents, fetchEmailStats } from '@/lib/api/email-events';

const EmailAnalyticsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['email-stats'],
    queryFn: fetchEmailStats,
  });

  const { data: eventsData, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['email-events'],
    queryFn: () => fetchEmailEvents(100, 0),
  });

  const handleRefresh = () => {
    refetchStats();
    refetchEvents();
  };

  const filteredEvents = eventsData?.events.filter((event) =>
    event.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const defaultStats = {
    total_sent: 0,
    total_delivered: 0,
    total_opened: 0,
    total_clicked: 0,
    total_bounced: 0,
    total_complained: 0,
    delivery_rate: 0,
    open_rate: 0,
    click_rate: 0,
    bounce_rate: 0,
  };

  return (
    <RequireAdmin>
      <Helmet>
        <title>Email Analytics | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-mansagold/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/admin-dashboard">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Email <span className="text-mansagold">Analytics</span>
                </h1>
                <p className="text-white/60 text-sm">
                  Track email delivery, opens, clicks, and more
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <EmailStatsCards stats={stats || defaultStats} isLoading={statsLoading} />
          </div>

          {/* Events Table */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-mansagold" />
                Recent Email Events
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </CardHeader>
            <CardContent>
              <EmailEventsTable events={filteredEvents} isLoading={eventsLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAdmin>
  );
};

export default EmailAnalyticsPage;
