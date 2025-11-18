import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { 
  Image, DollarSign, Users, Package, FileText, TrendingUp,
  CreditCard, Building2, Calendar, BarChart3, Settings,
  Sparkles, ArrowRight
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
  { id: 'products', title: 'Product Images', description: 'Upload, edit, and optimize product images with compression and batch tools', icon: <Image className="h-6 w-6" />, category: 'core', path: '/products', status: 'popular' },
  { id: 'financials', title: 'Financial Management', description: 'Complete accounting suite with invoices, expenses, and financial reports', icon: <DollarSign className="h-6 w-6" />, category: 'financial', path: '/financials', status: 'popular' },
  { id: 'customers', title: 'Customer Management', description: 'Track customer profiles, interactions, and communication history', icon: <Users className="h-6 w-6" />, category: 'core', path: '/customers' },
  { id: 'inventory', title: 'Inventory Management', description: 'Monitor stock levels, set reorder points, and get low stock alerts', icon: <Package className="h-6 w-6" />, category: 'core', path: '/inventory' },
  { id: 'invoices', title: 'Invoicing', description: 'Create professional invoices, track payments, and manage recurring billing', icon: <FileText className="h-6 w-6" />, category: 'financial', path: '/financials' },
  { id: 'reports', title: 'Financial Reports', description: 'Balance sheets, P&L, cash flow statements, and A/R aging', icon: <TrendingUp className="h-6 w-6" />, category: 'financial', path: '/financials', status: 'new' },
  { id: 'bank-rec', title: 'Bank Reconciliation', description: 'Connect bank accounts and automatically reconcile transactions', icon: <Building2 className="h-6 w-6" />, category: 'financial', path: '/financials', status: 'new' },
  { id: 'budgets', title: 'Budgets & Forecasting', description: 'Set category budgets, compare actual vs planned spending', icon: <BarChart3 className="h-6 w-6" />, category: 'financial', path: '/financials', status: 'new' },
  { id: 'assets', title: 'Fixed Assets', description: 'Track assets and calculate depreciation automatically', icon: <CreditCard className="h-6 w-6" />, category: 'advanced', path: '/financials', status: 'new' },
  { id: 'bookings', title: 'Booking Management', description: 'Schedule appointments and manage service bookings', icon: <Calendar className="h-6 w-6" />, category: 'core', path: '/bookings' },
  { id: 'settings', title: 'Business Settings', description: 'Configure your business profile, tax rates, and preferences', icon: <Settings className="h-6 w-6" />, category: 'core', path: '/settings' }
];

export const FeatureDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'financial' | 'advanced'>('all');

  const filteredFeatures = activeTab === 'all' ? features : features.filter(f => f.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-mansablue/5 to-mansagold/5 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-mansablue/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-mansagold/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-mansagold/50">
              <Sparkles className="h-5 w-5 text-mansagold-dark" />
              <span className="text-sm font-bold text-mansablue-dark">Discover All Features</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-mansablue-dark">Business Management Made Simple</h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">Everything you need to run and grow your business, all in one place.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-12">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-14 bg-card/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-mansablue-dark data-[state=active]:text-white font-semibold">All</TabsTrigger>
              <TabsTrigger value="core" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-mansablue-dark data-[state=active]:text-white font-semibold">Core</TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-mansagold-dark data-[state=active]:text-mansablue-dark font-semibold">Financial</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => (
            <ScrollReveal key={feature.id} delay={0.1 * (index % 6)}>
              <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-mansagold/50 transition-all duration-500 cursor-pointer bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-mansagold/10 hover:-translate-y-1" onClick={() => navigate(feature.path)}>
                <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 via-transparent to-mansagold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.category === 'core' ? 'bg-gradient-to-br from-mansablue/20 to-mansablue/10' : feature.category === 'financial' ? 'bg-gradient-to-br from-mansagold/20 to-mansagold/10' : 'bg-gradient-to-br from-purple-500/20 to-indigo-500/10'}`}>
                      <div className={feature.category === 'core' ? 'text-mansablue' : feature.category === 'financial' ? 'text-mansagold-dark' : 'text-purple-600'}>{feature.icon}</div>
                    </div>
                    <Badge className={feature.category === 'core' ? 'bg-gradient-to-r from-mansablue/20 to-mansablue/10 text-mansablue border border-mansablue/30' : feature.category === 'financial' ? 'bg-gradient-to-r from-mansagold/20 to-mansagold/10 text-mansagold-dark border border-mansagold/30' : 'bg-gradient-to-r from-purple-500/20 to-purple-400/10 text-purple-700 border border-purple-400/30'}>{feature.category}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-mansablue transition-all duration-300">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-foreground/70 leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button variant="ghost" className="w-full group-hover:bg-gradient-to-r group-hover:from-mansablue group-hover:to-mansablue-dark group-hover:text-white font-semibold transition-all duration-300 group/btn">Explore Feature <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" /></Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-20">
            <Card className="bg-gradient-to-br from-mansablue via-mansablue-dark to-mansagold border-0 text-white overflow-hidden relative">
              <CardHeader className="relative z-10 py-12 text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</CardTitle>
                <CardDescription className="text-white/90 text-lg max-w-2xl mx-auto">Join thousands of businesses using our platform</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-12 text-center">
                <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => navigate('/dashboard')}>Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default FeatureDiscovery;
