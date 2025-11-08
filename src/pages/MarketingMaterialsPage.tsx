import React, { useState, useEffect } from 'react';
import { Download, Share2, Image, Mail, MessageSquare, FileText, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { nativeShare, copyToClipboard } from '@/utils/social-share';
import { getMarketingMaterials } from '@/lib/api/marketing-materials-api';
import { MarketingMaterial, MaterialType } from '@/types/marketing-material';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getCategories, getTags, getMaterialsWithFilters } from '@/lib/api/material-categories-api';
import { MaterialCategory, MaterialTag, MaterialWithCategoriesAndTags } from '@/types/material-category';
import MaterialFilters from '@/components/marketing/MaterialFilters';


const getIconForType = (type: MaterialType) => {
  switch (type) {
    case 'banner':
      return Image;
    case 'social':
      return MessageSquare;
    case 'email':
      return Mail;
    case 'document':
      return FileText;
    default:
      return FileText;
  }
};

const MarketingMaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [materials, setMaterials] = useState<MaterialWithCategoriesAndTags[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [tags, setTags] = useState<MaterialTag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [selectedCategories, selectedTags, activeTab]);

  const loadFilters = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getTags()
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading filters:', error);
      toast.error('Failed to load filters');
    }
  };

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'all' ? undefined : activeTab;
      const data = await getMaterialsWithFilters(
        selectedCategories.length > 0 ? selectedCategories : undefined,
        selectedTags.length > 0 ? selectedTags : undefined,
        type
      );
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('Failed to load marketing materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material: MarketingMaterial) => {
    if (!material.file_url) {
      toast.error('No file available for download');
      return;
    }

    try {
      // Track download with user info
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { trackMaterialDownload } = await import('@/lib/api/marketing-analytics-api');
        await trackMaterialDownload(material.id, user.id);
      }
      
      // Trigger download
      window.open(material.file_url, '_blank');
      toast.success(`${material.title} is being downloaded...`);
      
      // Reload to update download count
      loadMaterials();
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Failed to download material');
    }
  };

  const handleShare = async (material: MarketingMaterial) => {
    const shareData = {
      title: material.title,
      text: material.description || material.title,
      url: material.file_url || window.location.origin
    };

    const shared = await nativeShare(shareData);
    if (!shared) {
      await copyToClipboard(shareData.url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const filterMaterials = (type: string) => {
    if (type === 'all') return materials;
    return materials.filter(m => m.type === type);
  };

  const filteredMaterials = filterMaterials(activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/sales-agent-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Marketing Materials Hub</h1>
              <p className="text-muted-foreground text-lg">
                Download promotional content to boost your referral efforts
              </p>
            </div>
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedCategories.length + selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Materials</SheetTitle>
                  <SheetDescription>
                    Refine materials by categories and tags
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <MaterialFilters
                    categories={categories}
                    tags={tags}
                    selectedCategories={selectedCategories}
                    selectedTags={selectedTags}
                    onCategoryToggle={handleCategoryToggle}
                    onTagToggle={handleTagToggle}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="banner">Banners</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredMaterials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No marketing materials available yet. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => {
                  const Icon = getIconForType(material.type);
                  return (
                    <Card key={material.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{material.title}</CardTitle>
                              {material.dimensions && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {material.dimensions}
                                </p>
                              )}
                                <p className="text-xs text-muted-foreground">
                                  {material.download_count} downloads
                                </p>
                              </div>
                            </div>
                          </div>
                          {(material.categories.length > 0 || material.tags.length > 0) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {material.categories.map(cat => (
                                <Badge
                                  key={cat.id}
                                  variant="secondary"
                                  style={cat.color ? { backgroundColor: cat.color + '20', color: cat.color } : undefined}
                                  className="text-xs"
                                >
                                  {cat.name}
                                </Badge>
                              ))}
                              {material.tags.slice(0, 3).map(tag => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                              {material.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{material.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {material.description}
                        </CardDescription>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleDownload(material)}
                            className="flex-1"
                            size="sm"
                            disabled={!material.file_url}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            onClick={() => handleShare(material)}
                            variant="outline"
                            size="sm"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Usage Tips */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Marketing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • <strong>Personalize your outreach:</strong> Add your referral code to all shared materials
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Use social proof:</strong> Share success stories and testimonials
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Be consistent:</strong> Post regularly across all platforms
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Track results:</strong> Monitor which materials drive the most referrals
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Engage authentically:</strong> Share your genuine passion for economic empowerment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingMaterialsPage;
