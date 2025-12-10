import { useState } from 'react';
import { useB2B } from '@/hooks/use-b2b';
import { B2BImpactCard } from './B2BImpactCard';
import { SupplierCard } from './SupplierCard';
import { NeedCard } from './NeedCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { ConnectionRequestModal } from './ConnectionRequestModal';
import { BusinessCapability, BusinessNeed } from '@/hooks/use-b2b';

export function B2BMarketplace() {
  const { 
    allCapabilities, 
    allNeeds, 
    impactMetrics, 
    loading, 
    initiateConnection,
    B2B_CATEGORIES 
  } = useB2B();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BusinessCapability | BusinessNeed | null>(null);
  const [modalType, setModalType] = useState<'capability' | 'need' | null>(null);

  const filteredCapabilities = allCapabilities.filter(cap => {
    const matchesSearch = !searchQuery || 
      cap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cap.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredNeeds = allNeeds.filter(need => {
    const matchesSearch = !searchQuery || 
      need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || need.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (item: BusinessCapability | BusinessNeed, type: 'capability' | 'need') => {
    setSelectedItem(item);
    setModalType(type);
  };

  const handleSubmitConnection = async (notes: string) => {
    if (!selectedItem) return;
    
    if (modalType === 'capability') {
      await initiateConnection(
        (selectedItem as BusinessCapability).business_id,
        undefined,
        selectedItem.id,
        notes
      );
    } else {
      await initiateConnection(
        (selectedItem as BusinessNeed).business_id,
        selectedItem.id,
        undefined,
        notes
      );
    }
    
    setSelectedItem(null);
    setModalType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impact Metrics */}
      {impactMetrics && <B2BImpactCard metrics={impactMetrics} />}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search suppliers or needs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-amber-500/50 focus:ring-amber-500/20"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-slate-800/50 border-white/10 text-white">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/10">
            <SelectItem value="all" className="text-white hover:bg-white/10">All Categories</SelectItem>
            {B2B_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10 p-1">
          <TabsTrigger 
            value="suppliers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 text-slate-300"
          >
            Suppliers ({filteredCapabilities.length})
          </TabsTrigger>
          <TabsTrigger 
            value="needs"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 text-slate-300"
          >
            Business Needs ({filteredNeeds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          {filteredCapabilities.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-slate-400 mb-4">No suppliers found matching your criteria</p>
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                <Plus className="h-4 w-4 mr-2" />
                List Your Business as a Supplier
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCapabilities.map((capability) => (
                <SupplierCard
                  key={capability.id}
                  capability={capability}
                  onConnect={() => handleConnect(capability, 'capability')}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="needs" className="space-y-4">
          {filteredNeeds.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-slate-400 mb-4">No open business needs found</p>
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                <Plus className="h-4 w-4 mr-2" />
                Post What You Need
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNeeds.map((need) => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onConnect={() => handleConnect(need, 'need')}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Connection Request Modal */}
      <ConnectionRequestModal
        isOpen={!!selectedItem && !!modalType}
        onClose={() => {
          setSelectedItem(null);
          setModalType(null);
        }}
        onSubmit={handleSubmitConnection}
        itemTitle={selectedItem?.title || ''}
        businessName={
          (selectedItem as any)?.business?.business_name || 'Business'
        }
      />
    </div>
  );
}
