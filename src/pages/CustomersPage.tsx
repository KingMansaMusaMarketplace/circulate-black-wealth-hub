import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Users, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      
      // Get business ID
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

      // Load customers and analytics
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.customer_status === statusFilter);
    }

    // Lifecycle filter
    if (lifecycleFilter !== 'all') {
      filtered = filtered.filter(c => c.lifecycle_stage === lifecycleFilter);
    }

    setFilteredCustomers(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vip: 'bg-purple-100 text-purple-800'
    };
    return variants[status] || variants.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto p-6 space-y-6 relative z-10">
          <Skeleton className="h-12 w-64 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-red-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="relative inline-block w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 via-rose-400/30 to-red-400/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"></div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    Customer <span className="text-yellow-500">Relationship</span> Management 💼
                  </h1>
                  <p className="text-gray-700 text-xl font-medium">
                    Manage and track all your customer relationships 🎯
                  </p>
                </div>
                <Button onClick={() => navigate('/customers/new')} className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">Total Customers</CardTitle>
              <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">{analytics.totalCustomers}</div>
              <p className="text-xs text-pink-600">
                {analytics.activeCustomers} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">VIP Customers</CardTitle>
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full">
                <Star className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{analytics.vipCustomers}</div>
              <p className="text-xs text-yellow-600">Premium tier</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Active Leads</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{analytics.leads}</div>
              <p className="text-xs text-blue-600">In pipeline</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Total LTV</CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                ${analytics.totalLifetimeValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: ${analytics.avgLifetimeValue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="evangelist">Evangelist</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lifecycle</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No customers found. Add your first customer to get started!
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </TableCell>
                    <TableCell>{customer.company || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.email || '-'}</div>
                        <div className="text-muted-foreground">{customer.phone || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(customer.customer_status)}>
                        {customer.customer_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{customer.lifecycle_stage}</TableCell>
                    <TableCell>${customer.lifetime_value.toFixed(2)}</TableCell>
                    <TableCell>
                      {customer.last_contact_date 
                        ? format(new Date(customer.last_contact_date), 'MMM d, yyyy')
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
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
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
