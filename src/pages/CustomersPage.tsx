import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCustomers, getCRMAnalytics, Customer } from '@/lib/api/customer-api';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [analytics, setAnalytics] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter, lifecycleFilter]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!businesses) {
        toast.error('No business found');
        return;
      }

      setBusinessId(businesses.id);

      const [customersData, analyticsData] = await Promise.all([
        getCustomers(businesses.id),
        getCRMAnalytics(businesses.id)
      ]);

      setCustomers(customersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.customer_status === statusFilter);
    }

    if (lifecycleFilter !== 'all') {
      filtered = filtered.filter(c => c.lifecycle_stage === lifecycleFilter);
    }

    setFilteredCustomers(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-white/10 text-white/60 border-white/20',
      vip: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return variants[status] || variants.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="container mx-auto p-6 space-y-6 relative z-10">
          <Skeleton className="h-12 w-64 rounded-2xl bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-white">
                  Customer <span className="text-yellow-400">Relationship</span> Management
                </h1>
                <p className="text-blue-200 text-lg">
                  Manage and track all your customer relationships
                </p>
              </div>
              <Button 
                onClick={() => navigate('/customers/new')} 
                className="gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-200">Total Customers</span>
                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{analytics.totalCustomers}</div>
              <p className="text-sm text-blue-300">{analytics.activeCustomers} active</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-yellow-200">VIP Customers</span>
                <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{analytics.vipCustomers}</div>
              <p className="text-sm text-yellow-300">Premium tier</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-purple-200">Active Leads</span>
                <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{analytics.leads}</div>
              <p className="text-sm text-purple-300">In pipeline</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-green-200">Total LTV</span>
                <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/30">
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">${analytics.totalLifetimeValue.toFixed(2)}</div>
              <p className="text-sm text-green-300">Avg: ${analytics.avgLifetimeValue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="evangelist">Evangelist</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-blue-200">Name</TableHead>
                <TableHead className="text-blue-200">Company</TableHead>
                <TableHead className="text-blue-200">Contact</TableHead>
                <TableHead className="text-blue-200">Status</TableHead>
                <TableHead className="text-blue-200">Lifecycle</TableHead>
                <TableHead className="text-blue-200">LTV</TableHead>
                <TableHead className="text-blue-200">Last Contact</TableHead>
                <TableHead className="text-blue-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={8} className="text-center text-blue-200 py-8">
                    No customers found. Add your first customer to get started!
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-white/5 border-white/10"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium text-white">
                      {customer.first_name} {customer.last_name}
                    </TableCell>
                    <TableCell className="text-blue-200">{customer.company || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-white">{customer.email || '-'}</div>
                        <div className="text-blue-300">{customer.phone || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(customer.customer_status)}>
                        {customer.customer_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-blue-200">{customer.lifecycle_stage}</TableCell>
                    <TableCell className="text-white">${customer.lifetime_value.toFixed(2)}</TableCell>
                    <TableCell className="text-blue-200">
                      {customer.last_contact_date 
                        ? format(new Date(customer.last_contact_date), 'MMM d, yyyy')
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${customer.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
