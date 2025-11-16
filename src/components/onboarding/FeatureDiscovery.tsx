import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Image, 
  DollarSign, 
  Users, 
  Package, 
  FileText, 
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'core' | 'financial' | 'advanced';
  path: string;
  status?: 'new' | 'popular' | 'beta';
}

const features: Feature[] = [
  {
    id: 'products',
    title: 'Product Images',
    description: 'Upload, edit, and optimize product images with compression and batch tools',
    icon: <Image className="h-6 w-6" />,
    category: 'core',
    path: '/products',
    status: 'popular'
  },
  {
    id: 'financials',
    title: 'Financial Management',
    description: 'Complete accounting suite with invoices, expenses, and financial reports',
    icon: <DollarSign className="h-6 w-6" />,
    category: 'financial',
    path: '/financials',
    status: 'popular'
  },
  {
    id: 'customers',
    title: 'Customer Management',
    description: 'Track customer profiles, interactions, and communication history',
    icon: <Users className="h-6 w-6" />,
    category: 'core',
    path: '/customers'
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Monitor stock levels, set reorder points, and get low stock alerts',
    icon: <Package className="h-6 w-6" />,
    category: 'core',
    path: '/inventory'
  },
  {
    id: 'invoices',
    title: 'Invoicing',
    description: 'Create professional invoices, track payments, and manage recurring billing',
    icon: <FileText className="h-6 w-6" />,
    category: 'financial',
    path: '/financials'
  },
  {
    id: 'reports',
    title: 'Financial Reports',
    description: 'Balance sheets, P&L, cash flow statements, and A/R aging',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'financial',
    path: '/financials',
    status: 'new'
  },
  {
    id: 'bank-rec',
    title: 'Bank Reconciliation',
    description: 'Connect bank accounts and automatically reconcile transactions',
    icon: <Building2 className="h-6 w-6" />,
    category: 'financial',
    path: '/financials',
    status: 'new'
  },
  {
    id: 'budgets',
    title: 'Budgets & Forecasting',
    description: 'Set category budgets, compare actual vs planned spending',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'financial',
    path: '/financials',
    status: 'new'
  },
  {
    id: 'assets',
    title: 'Fixed Assets',
    description: 'Track assets and calculate depreciation automatically',
    icon: <CreditCard className="h-6 w-6" />,
    category: 'advanced',
    path: '/financials',
    status: 'new'
  },
  {
    id: 'bookings',
    title: 'Booking Management',
    description: 'Schedule appointments and manage service bookings',
    icon: <Calendar className="h-6 w-6" />,
    category: 'core',
    path: '/bookings'
  },
  {
    id: 'settings',
    title: 'Business Settings',
    description: 'Configure your business profile, tax rates, and preferences',
    icon: <Settings className="h-6 w-6" />,
    category: 'core',
    path: '/settings'
  }
];

export const FeatureDiscovery: React.FC = () => {
  const navigate = useNavigate();

  const getCategoryBadge = (category: string) => {
    const colors = {
      core: 'bg-blue-500/10 text-blue-500',
      financial: 'bg-green-500/10 text-green-500',
      advanced: 'bg-purple-500/10 text-purple-500'
    };
    return colors[category as keyof typeof colors] || colors.core;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const badges = {
      new: <Badge variant="secondary" className="bg-primary/10 text-primary">New</Badge>,
      popular: <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">Popular</Badge>,
      beta: <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Beta</Badge>
    };
    return badges[status as keyof typeof badges];
  };

  const groupedFeatures = {
    core: features.filter(f => f.category === 'core'),
    financial: features.filter(f => f.category === 'financial'),
    advanced: features.filter(f => f.category === 'advanced')
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Feature Discovery</h1>
          <p className="text-muted-foreground">Explore all the powerful features available for your business</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Core Features */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Core Features</h2>
            <p className="text-muted-foreground">Essential tools to run your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedFeatures.core.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(feature.path)} 
                    className="w-full"
                    variant="outline"
                  >
                    Explore Feature
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Financial Features */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Financial Management</h2>
            <p className="text-muted-foreground">Complete accounting and financial tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedFeatures.financial.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                      {feature.icon}
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(feature.path)} 
                    className="w-full"
                    variant="outline"
                  >
                    Explore Feature
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Advanced Tools</h2>
            <p className="text-muted-foreground">Specialized features for growing businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedFeatures.advanced.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                      {feature.icon}
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate(feature.path)} 
                    className="w-full"
                    variant="outline"
                  >
                    Explore Feature
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeatureDiscovery;
