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
import { MaterialRecommendations } from '@/components/marketing/MaterialRecommendations';


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

  const handleDownloadById = async (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) {
      toast.error('Material not found');
      return;
    }
    await handleDownload(material);
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
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mansablue via-primary to-mansagold p-8 mb-6 shadow-xl">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent mb-3">
                📚 Marketing Materials Hub
              </h1>
              <p className="text-white/90 text-xl font-medium">
                Download promotional content to boost your referral efforts 🚀
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-mansablue/10">
                  <Filter className="mr-2 h-4 w-4 text-primary" />
                  Filters
                  {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                    <Badge className="ml-2 bg-gradient-to-r from-mansablue to-primary text-white">
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

        {/* Recommendations */}
        <div className="mb-8">
          <MaterialRecommendations onDownload={handleDownloadById} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gradient-to-r from-primary/10 via-mansagold/10 to-mansablue/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-primary data-[state=active]:text-white">All Materials</TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Banners</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Social Media</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-amber-500 data-[state=active]:text-white">Email Templates</TabsTrigger>
            <TabsTrigger value="document" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredMaterials.length === 0 ? (
              <Card className="bg-gradient-to-br from-primary/5 via-mansagold/5 to-mansablue/5 border-2 border-primary/20">
                <CardContent className="py-16 text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-mansablue/20 to-primary/20 rounded-full mb-4">
                    <FileText className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-lg font-medium bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
                    No marketing materials available yet. Check back soon! 🎨
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => {
                  const Icon = getIconForType(material.type);
                  const getTypeGradient = (type: MaterialType) => {
                    switch (type) {
                      case 'banner': return 'from-pink-500/20 to-purple-500/20 border-pink-300';
                      case 'social': return 'from-blue-500/20 to-cyan-500/20 border-blue-300';
                      case 'email': return 'from-mansagold/20 to-amber-500/20 border-mansagold';
                      case 'document': return 'from-green-500/20 to-emerald-500/20 border-green-300';
                      default: return 'from-primary/20 to-mansablue/20 border-primary/30';
                    }
                  };
                  const getIconGradient = (type: MaterialType) => {
                    switch (type) {
                      case 'banner': return 'bg-gradient-to-br from-pink-500 to-purple-500';
                      case 'social': return 'bg-gradient-to-br from-blue-500 to-cyan-500';
                      case 'email': return 'bg-gradient-to-br from-mansagold to-amber-500';
                      case 'document': return 'bg-gradient-to-br from-green-500 to-emerald-500';
                      default: return 'bg-gradient-to-br from-mansablue to-primary';
                    }
                  };
                  return (
                    <Card key={material.id} className={`hover:shadow-xl transition-all hover:scale-105 border-2 bg-gradient-to-br ${getTypeGradient(material.type)}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-xl ${getIconGradient(material.type)} shadow-lg`}>
                              <Icon className="h-6 w-6 text-white" />
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
                            className="flex-1 bg-gradient-to-r from-mansablue to-primary hover:from-mansablue/90 hover:to-primary/90"
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
                            className="border-primary/30 hover:bg-primary/10"
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
        <Card className="mt-8 bg-gradient-to-br from-mansagold/10 via-primary/10 to-mansablue/10 border-2 border-primary/20 shadow-lg">
          <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-mansablue/5">
            <CardTitle className="text-2xl bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent flex items-center gap-2">
              💡 Marketing Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50">
              <span className="text-2xl">🎯</span>
              <p className="text-sm">
                <strong className="text-foreground">Personalize your outreach:</strong> <span className="text-muted-foreground">Add your referral code to all shared materials</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50">
              <span className="text-2xl">⭐</span>
              <p className="text-sm">
                <strong className="text-foreground">Use social proof:</strong> <span className="text-muted-foreground">Share success stories and testimonials</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50">
              <span className="text-2xl">📅</span>
              <p className="text-sm">
                <strong className="text-foreground">Be consistent:</strong> <span className="text-muted-foreground">Post regularly across all platforms</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/50">
              <span className="text-2xl">📊</span>
              <p className="text-sm">
                <strong className="text-foreground">Track results:</strong> <span className="text-muted-foreground">Monitor which materials drive the most referrals</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20 border border-rose-200/50">
              <span className="text-2xl">💚</span>
              <p className="text-sm">
                <strong className="text-foreground">Engage authentically:</strong> <span className="text-muted-foreground">Share your genuine passion for economic empowerment</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingMaterialsPage;
