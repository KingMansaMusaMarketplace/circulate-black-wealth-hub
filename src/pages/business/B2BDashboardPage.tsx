import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { useB2B } from '@/hooks/use-b2b';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Package, Search, Handshake, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';

const B2B_CATEGORIES = [
  'Food & Catering',
  'Marketing & Advertising',
  'IT & Technology',
  'Professional Services',
  'Manufacturing',
  'Printing & Signage',
  'Office Supplies',
  'Cleaning Services',
  'Construction & Trades',
  'Transportation & Logistics',
  'Events & Entertainment',
  'Other'
];

export default function B2BDashboardPage() {
  const { user } = useAuth();
  const { profile } = useBusinessProfile();
  const { 
    capabilities, 
    needs, 
    connections, 
    impactMetrics,
    addCapability, 
    addNeed
  } = useB2B();

  const [showCapabilityForm, setShowCapabilityForm] = useState(false);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [isAddingCapability, setIsAddingCapability] = useState(false);
  const [isAddingNeed, setIsAddingNeed] = useState(false);
  
  // Form states
  const [capabilityForm, setCapabilityForm] = useState({
    title: '',
    category: '',
    description: '',
    capability_type: 'supplier',
    minimum_order_value: '',
    lead_time_days: ''
  });
  
  const [needForm, setNeedForm] = useState({
    title: '',
    category: '',
    description: '',
    need_type: 'recurring',
    budget_min: '',
    budget_max: '',
    urgency: 'within_month'
  });

  const handleAddCapability = async () => {
    if (!profile?.id) return;
    
    setIsAddingCapability(true);
    try {
      await addCapability({
        business_id: profile.id,
        title: capabilityForm.title,
        category: capabilityForm.category,
        description: capabilityForm.description,
        capability_type: capabilityForm.capability_type,
        minimum_order_value: capabilityForm.minimum_order_value ? parseFloat(capabilityForm.minimum_order_value) : null,
        lead_time_days: capabilityForm.lead_time_days ? parseInt(capabilityForm.lead_time_days) : null
      });
      
      setCapabilityForm({ title: '', category: '', description: '', capability_type: 'supplier', minimum_order_value: '', lead_time_days: '' });
      setShowCapabilityForm(false);
    } finally {
      setIsAddingCapability(false);
    }
  };

  const handleAddNeed = async () => {
    if (!profile?.id) return;
    
    setIsAddingNeed(true);
    try {
      await addNeed({
        business_id: profile.id,
        title: needForm.title,
        category: needForm.category,
        description: needForm.description,
        need_type: needForm.need_type,
        budget_min: needForm.budget_min ? parseFloat(needForm.budget_min) : null,
        budget_max: needForm.budget_max ? parseFloat(needForm.budget_max) : null,
        urgency: needForm.urgency
      });
      
      setNeedForm({ title: '', category: '', description: '', need_type: 'recurring', budget_min: '', budget_max: '', urgency: 'within_month' });
      setShowNeedForm(false);
    } finally {
      setIsAddingNeed(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl max-w-md p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Business Profile Required</h2>
          <p className="text-slate-400 mb-4">
            You need a verified business profile to access the B2B Dashboard.
          </p>
          <Link to="/business-form">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
              Create Business Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>B2B Dashboard | MansaMusa</title>
        <meta name="description" content="Manage your B2B listings, capabilities, and connections with other Black-owned businesses." />
      </Helmet>

      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-400/15 to-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-slate-900/50 sticky top-0">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/b2b-marketplace">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Marketplace
                </Button>
              </Link>
              <h1 className="font-semibold text-white">B2B Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="relative z-10 container py-6 max-w-6xl">
          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Package className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Capabilities</span>
              </div>
              <p className="text-2xl font-bold text-white">{capabilities.length}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Search className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Active Needs</span>
              </div>
              <p className="text-2xl font-bold text-white">{needs.filter(n => n.status === 'open').length}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Handshake className="h-4 w-4 text-amber-400" />
                <span className="text-sm">Connections</span>
              </div>
              <p className="text-2xl font-bold text-white">{connections.length}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-sm">B2B Value</span>
              </div>
              <p className="text-2xl font-bold text-white">${impactMetrics?.total_transaction_value?.toLocaleString() || 0}</p>
            </div>
          </div>

          <Tabs defaultValue="capabilities" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="capabilities" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">My Capabilities</TabsTrigger>
              <TabsTrigger value="needs" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">My Needs</TabsTrigger>
              <TabsTrigger value="connections" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Connections</TabsTrigger>
            </TabsList>

            {/* Capabilities Tab */}
            <TabsContent value="capabilities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">What You Can Supply</h2>
                  <p className="text-sm text-slate-400">List your products and services for other businesses</p>
                </div>
                <Button onClick={() => setShowCapabilityForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Capability
                </Button>
              </div>

              {showCapabilityForm && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Add New Capability</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Title</Label>
                        <Input 
                          placeholder="e.g., Custom Printing Services"
                          value={capabilityForm.title}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, title: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Category</Label>
                        <Select value={capabilityForm.category} onValueChange={(v) => setCapabilityForm(f => ({ ...f, category: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/20">
                            {B2B_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea 
                        placeholder="Describe what you offer..."
                        value={capabilityForm.description}
                        onChange={(e) => setCapabilityForm(f => ({ ...f, description: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Type</Label>
                        <Select value={capabilityForm.capability_type} onValueChange={(v) => setCapabilityForm(f => ({ ...f, capability_type: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/20">
                            <SelectItem value="supplier" className="text-white hover:bg-white/10">Supplier</SelectItem>
                            <SelectItem value="vendor" className="text-white hover:bg-white/10">Vendor</SelectItem>
                            <SelectItem value="contractor" className="text-white hover:bg-white/10">Contractor</SelectItem>
                            <SelectItem value="service_provider" className="text-white hover:bg-white/10">Service Provider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Min Order Value ($)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g., 500"
                          value={capabilityForm.minimum_order_value}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, minimum_order_value: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Lead Time (days)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g., 7"
                          value={capabilityForm.lead_time_days}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, lead_time_days: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowCapabilityForm(false)} className="border-white/20 text-slate-300 hover:bg-white/10">Cancel</Button>
                      <Button onClick={handleAddCapability} disabled={isAddingCapability || !capabilityForm.title || !capabilityForm.category} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                        {isAddingCapability ? 'Adding...' : 'Add Capability'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {capabilities.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl">
                  <div className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">No capabilities listed yet.</p>
                    <p className="text-sm text-slate-500">Add what your business can supply to other businesses.</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {capabilities.map((cap) => (
                    <div key={cap.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{cap.title}</h3>
                          <Badge variant="secondary" className="mt-1 bg-amber-500/20 text-amber-400 border-amber-500/30">{cap.category}</Badge>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{cap.capability_type}</Badge>
                      </div>
                      {cap.description && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{cap.description}</p>
                      )}
                      <div className="flex gap-4 mt-3 text-sm text-slate-500">
                        {cap.minimum_order_value && <span>Min: ${cap.minimum_order_value}</span>}
                        {cap.lead_time_days && <span>Lead: {cap.lead_time_days} days</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Needs Tab */}
            <TabsContent value="needs" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">What You Need</h2>
                  <p className="text-sm text-slate-400">Post what you're looking for from other businesses</p>
                </div>
                <Button onClick={() => setShowNeedForm(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Need
                </Button>
              </div>

              {showNeedForm && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Post New Need</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Title</Label>
                        <Input 
                          placeholder="e.g., Looking for catering partner"
                          value={needForm.title}
                          onChange={(e) => setNeedForm(f => ({ ...f, title: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Category</Label>
                        <Select value={needForm.category} onValueChange={(v) => setNeedForm(f => ({ ...f, category: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/20">
                            {B2B_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Description</Label>
                      <Textarea 
                        placeholder="Describe what you need..."
                        value={needForm.description}
                        onChange={(e) => setNeedForm(f => ({ ...f, description: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Type</Label>
                        <Select value={needForm.need_type} onValueChange={(v) => setNeedForm(f => ({ ...f, need_type: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/20">
                            <SelectItem value="recurring" className="text-white hover:bg-white/10">Recurring</SelectItem>
                            <SelectItem value="one_time" className="text-white hover:bg-white/10">One-time</SelectItem>
                            <SelectItem value="project" className="text-white hover:bg-white/10">Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Min Budget ($)</Label>
                        <Input 
                          type="number"
                          value={needForm.budget_min}
                          onChange={(e) => setNeedForm(f => ({ ...f, budget_min: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Max Budget ($)</Label>
                        <Input 
                          type="number"
                          value={needForm.budget_max}
                          onChange={(e) => setNeedForm(f => ({ ...f, budget_max: e.target.value }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Urgency</Label>
                        <Select value={needForm.urgency} onValueChange={(v) => setNeedForm(f => ({ ...f, urgency: v }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/20">
                            <SelectItem value="immediate" className="text-white hover:bg-white/10">Immediate</SelectItem>
                            <SelectItem value="within_month" className="text-white hover:bg-white/10">Within Month</SelectItem>
                            <SelectItem value="planning" className="text-white hover:bg-white/10">Planning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowNeedForm(false)} className="border-white/20 text-slate-300 hover:bg-white/10">Cancel</Button>
                      <Button onClick={handleAddNeed} disabled={isAddingNeed || !needForm.title || !needForm.category} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                        {isAddingNeed ? 'Posting...' : 'Post Need'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {needs.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl">
                  <div className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">No needs posted yet.</p>
                    <p className="text-sm text-slate-500">Post what you're looking for to find suppliers.</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {needs.map((need) => (
                    <div key={need.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{need.title}</h3>
                          <Badge variant="secondary" className="mt-1 bg-amber-500/20 text-amber-400 border-amber-500/30">{need.category}</Badge>
                        </div>
                        <Badge className={need.status === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>{need.status}</Badge>
                      </div>
                      {need.description && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{need.description}</p>
                      )}
                      <div className="flex gap-4 mt-3 text-sm text-slate-500">
                        {(need.budget_min || need.budget_max) && (
                          <span>Budget: ${need.budget_min || 0} - ${need.budget_max || '∞'}</span>
                        )}
                        {need.urgency && <span className="capitalize">{need.urgency.replace('_', ' ')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Business Connections</h2>
                <p className="text-sm text-slate-400">Your B2B relationships with other businesses</p>
              </div>

              {connections.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-xl">
                  <div className="py-12 text-center">
                    <Handshake className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">No connections yet.</p>
                    <p className="text-sm text-slate-500">Browse the marketplace to find suppliers and partners.</p>
                    <Link to="/b2b-marketplace">
                      <Button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">Browse Marketplace</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((conn) => (
                    <div key={conn.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Connection #{conn.id.slice(0, 8)}</p>
                          <p className="text-sm text-slate-400">
                            Status: <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{conn.status}</Badge>
                          </p>
                        </div>
                        {conn.estimated_value && (
                          <p className="text-lg font-semibold text-amber-400">${conn.estimated_value.toLocaleString()}</p>
                        )}
                      </div>
                      {conn.notes && (
                        <p className="text-sm text-slate-400 mt-2">{conn.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
