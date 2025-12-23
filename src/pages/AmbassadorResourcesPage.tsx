import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useAmbassadorResources, MarketingMaterial, TrainingContent } from '@/hooks/use-ambassador-resources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, GraduationCap, Loader2 } from 'lucide-react';
import MarketingMaterialsSection from '@/components/ambassador/MarketingMaterialsSection';
import TrainingContentSection from '@/components/ambassador/TrainingContentSection';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';

const AmbassadorResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAgent, agent, loading: agentLoading } = useSalesAgent();
  const {
    materials,
    trainingContent,
    trainingProgress,
    loading: resourcesLoading,
    trackDownload,
    updateTrainingProgress,
    getContentProgress,
    fetchTrainingProgress,
  } = useAmbassadorResources();

  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    if (agent?.id) {
      fetchTrainingProgress(agent.id);
    }
  }, [agent?.id]);

  const handleDownload = async (material: MarketingMaterial) => {
    try {
      await trackDownload(material.id);
      window.open(material.file_url, '_blank');
      toast.success(`Downloading ${material.title}`);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleStartContent = async (content: TrainingContent) => {
    if (!agent?.id) {
      toast.error('Please log in as an ambassador to track progress');
      return;
    }

    const url = content.external_url || content.content_url;
    if (url) {
      window.open(url, '_blank');
    }

    await updateTrainingProgress(agent.id, content.id, 'in_progress', 0);
    toast.success(`Started: ${content.title}`);
  };

  const handleMarkComplete = async (content: TrainingContent) => {
    if (!agent?.id) {
      toast.error('Please log in as an ambassador to track progress');
      return;
    }

    await updateTrainingProgress(agent.id, content.id, 'completed', 100);
    toast.success(`Completed: ${content.title}`, {
      description: 'Great job! Keep up the learning.',
    });
  };

  if (authLoading || agentLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Ambassador Resources</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to access marketing materials and training content.
          </p>
          <Button onClick={() => navigate('/auth')}>Log In</Button>
        </div>
      </MainLayout>
    );
  }

  if (!isAgent) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Ambassador Resources</h1>
          <p className="text-muted-foreground mb-6">
            This page is exclusively for Mansa Ambassadors. Apply today to get access!
          </p>
          <Button onClick={() => navigate('/mansa-ambassadors')}>
            Become an Ambassador
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Ambassador Resources</h1>
            <p className="text-muted-foreground">
              Access marketing materials and training to boost your success
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="materials" className="gap-2">
              <Package className="h-4 w-4" />
              Marketing Materials
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Training Center
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <MarketingMaterialsSection
              materials={materials}
              loading={resourcesLoading}
              onDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="training">
            <TrainingContentSection
              content={trainingContent}
              progress={trainingProgress}
              loading={resourcesLoading}
              onStartContent={handleStartContent}
              onMarkComplete={handleMarkComplete}
              getContentProgress={getContentProgress}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AmbassadorResourcesPage;
