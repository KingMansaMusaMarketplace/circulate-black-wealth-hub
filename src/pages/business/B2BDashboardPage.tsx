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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Business Profile Required</CardTitle>
            <CardDescription>
              You need a verified business profile to access the B2B Dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/business-form">
              <Button className="w-full">Create Business Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>B2B Dashboard | MansaMusa</title>
        <meta name="description" content="Manage your B2B listings, capabilities, and connections with other Black-owned businesses." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/b2b-marketplace">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Marketplace
                </Button>
              </Link>
              <h1 className="font-semibold">B2B Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="container py-6 max-w-6xl">
          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Capabilities</span>
                </div>
                <p className="text-2xl font-bold">{capabilities.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Active Needs</span>
                </div>
                <p className="text-2xl font-bold">{needs.filter(n => n.status === 'open').length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Handshake className="h-4 w-4" />
                  <span className="text-sm">Connections</span>
                </div>
                <p className="text-2xl font-bold">{connections.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">B2B Value</span>
                </div>
                <p className="text-2xl font-bold">${impactMetrics?.total_transaction_value?.toLocaleString() || 0}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="capabilities" className="space-y-6">
            <TabsList>
              <TabsTrigger value="capabilities">My Capabilities</TabsTrigger>
              <TabsTrigger value="needs">My Needs</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            {/* Capabilities Tab */}
            <TabsContent value="capabilities" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">What You Can Supply</h2>
                  <p className="text-sm text-muted-foreground">List your products and services for other businesses</p>
                </div>
                <Button onClick={() => setShowCapabilityForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Capability
                </Button>
              </div>

              {showCapabilityForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Capability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          placeholder="e.g., Custom Printing Services"
                          value={capabilityForm.title}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={capabilityForm.category} onValueChange={(v) => setCapabilityForm(f => ({ ...f, category: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {B2B_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Describe what you offer..."
                        value={capabilityForm.description}
                        onChange={(e) => setCapabilityForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={capabilityForm.capability_type} onValueChange={(v) => setCapabilityForm(f => ({ ...f, capability_type: v }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="service_provider">Service Provider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Min Order Value ($)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g., 500"
                          value={capabilityForm.minimum_order_value}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, minimum_order_value: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lead Time (days)</Label>
                        <Input 
                          type="number"
                          placeholder="e.g., 7"
                          value={capabilityForm.lead_time_days}
                          onChange={(e) => setCapabilityForm(f => ({ ...f, lead_time_days: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowCapabilityForm(false)}>Cancel</Button>
                      <Button onClick={handleAddCapability} disabled={isAddingCapability || !capabilityForm.title || !capabilityForm.category}>
                        {isAddingCapability ? 'Adding...' : 'Add Capability'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {capabilities.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No capabilities listed yet.</p>
                    <p className="text-sm">Add what your business can supply to other businesses.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {capabilities.map((cap) => (
                    <Card key={cap.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{cap.title}</h3>
                            <Badge variant="secondary" className="mt-1">{cap.category}</Badge>
                          </div>
                          <Badge>{cap.capability_type}</Badge>
                        </div>
                        {cap.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cap.description}</p>
                        )}
                        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                          {cap.minimum_order_value && <span>Min: ${cap.minimum_order_value}</span>}
                          {cap.lead_time_days && <span>Lead: {cap.lead_time_days} days</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Needs Tab */}
            <TabsContent value="needs" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">What You Need</h2>
                  <p className="text-sm text-muted-foreground">Post what you're looking for from other businesses</p>
                </div>
                <Button onClick={() => setShowNeedForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Need
                </Button>
              </div>

              {showNeedForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Post New Need</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          placeholder="e.g., Looking for catering partner"
                          value={needForm.title}
                          onChange={(e) => setNeedForm(f => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={needForm.category} onValueChange={(v) => setNeedForm(f => ({ ...f, category: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {B2B_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Describe what you need..."
                        value={needForm.description}
                        onChange={(e) => setNeedForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={needForm.need_type} onValueChange={(v) => setNeedForm(f => ({ ...f, need_type: v }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recurring">Recurring</SelectItem>
                            <SelectItem value="one_time">One-time</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Min Budget ($)</Label>
                        <Input 
                          type="number"
                          value={needForm.budget_min}
                          onChange={(e) => setNeedForm(f => ({ ...f, budget_min: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Budget ($)</Label>
                        <Input 
                          type="number"
                          value={needForm.budget_max}
                          onChange={(e) => setNeedForm(f => ({ ...f, budget_max: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Urgency</Label>
                        <Select value={needForm.urgency} onValueChange={(v) => setNeedForm(f => ({ ...f, urgency: v }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="within_month">Within Month</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowNeedForm(false)}>Cancel</Button>
                      <Button onClick={handleAddNeed} disabled={isAddingNeed || !needForm.title || !needForm.category}>
                        {isAddingNeed ? 'Posting...' : 'Post Need'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {needs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No needs posted yet.</p>
                    <p className="text-sm">Post what you're looking for to find suppliers.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {needs.map((need) => (
                    <Card key={need.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{need.title}</h3>
                            <Badge variant="secondary" className="mt-1">{need.category}</Badge>
                          </div>
                          <Badge variant={need.status === 'open' ? 'default' : 'outline'}>{need.status}</Badge>
                        </div>
                        {need.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{need.description}</p>
                        )}
                        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                          {(need.budget_min || need.budget_max) && (
                            <span>Budget: ${need.budget_min || 0} - ${need.budget_max || '∞'}</span>
                          )}
                          {need.urgency && <span className="capitalize">{need.urgency.replace('_', ' ')}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Business Connections</h2>
                <p className="text-sm text-muted-foreground">Your B2B relationships with other businesses</p>
              </div>

              {connections.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Handshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No connections yet.</p>
                    <p className="text-sm">Browse the marketplace to find suppliers and partners.</p>
                    <Link to="/b2b-marketplace">
                      <Button className="mt-4">Browse Marketplace</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {connections.map((conn) => (
                    <Card key={conn.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Connection #{conn.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: <Badge variant="outline">{conn.status}</Badge>
                            </p>
                          </div>
                          {conn.estimated_value && (
                            <p className="text-lg font-semibold">${conn.estimated_value.toLocaleString()}</p>
                          )}
                        </div>
                        {conn.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{conn.notes}</p>
                        )}
                      </CardContent>
                    </Card>
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
