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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers or needs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {B2B_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">
            Suppliers ({filteredCapabilities.length})
          </TabsTrigger>
          <TabsTrigger value="needs">
            Business Needs ({filteredNeeds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          {filteredCapabilities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No suppliers found matching your criteria</p>
              <Button variant="outline">
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
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No open business needs found</p>
              <Button variant="outline">
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
