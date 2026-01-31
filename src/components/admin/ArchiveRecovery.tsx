import React, { useState } from 'react';
import { Archive, RotateCcw, AlertCircle, CheckCircle2, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ArchivedFeature {
  id: string;
  name: string;
  category: string;
  description: string;
  archivedDate: string;
  reason: string;
  files: string[];
  tables: string[];
  isRestored: boolean;
}

// This will be populated as we archive features
const archivedFeatures: ArchivedFeature[] = [
  // Placeholder - features will be added here as we archive them
];

const ArchiveRecovery: React.FC = () => {
  const [features, setFeatures] = useState<ArchivedFeature[]>(archivedFeatures);
  const [selectedFeature, setSelectedFeature] = useState<ArchivedFeature | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  const handleRestore = async (featureId: string) => {
    setRestoring(featureId);
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFeatures(prev => 
      prev.map(f => f.id === featureId ? { ...f, isRestored: true } : f)
    );
    
    toast.success('Feature restored successfully', {
      description: 'The feature has been re-enabled. Rebuild to see changes.'
    });
    
    setRestoring(null);
  };

  const totalArchived = features.filter(f => !f.isRestored).length;
  const totalRestored = features.filter(f => f.isRestored).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Archive className="w-7 h-7 text-mansagold" />
            Feature Archive
          </h2>
          <p className="text-white/60 mt-1">
            Archived features for lean operation. Restore anytime with one click.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="border-amber-500/50 text-amber-400 px-3 py-1">
            <Package className="w-3.5 h-3.5 mr-1.5" />
            {totalArchived} Archived
          </Badge>
          <Badge variant="outline" className="border-green-500/50 text-green-400 px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            {totalRestored} Restored
          </Badge>
        </div>
      </div>

      {/* Empty State */}
      {features.length === 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mansagold/10 border border-mansagold/20 mb-4">
              <Archive className="w-8 h-8 text-mansagold" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Archived Features</h3>
            <p className="text-white/60 max-w-md mx-auto">
              When features are archived to focus on core circulation metrics, they'll appear here for easy recovery.
            </p>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-blue-300 font-medium">Ready for Archival</p>
                  <p className="text-sm text-white/60 mt-1">
                    Features like Badge Systems, Test Pages, and B2B Matching are candidates for archival to streamline the codebase.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className={`bg-white/5 border-white/10 transition-all ${
                feature.isRestored ? 'border-green-500/30' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{feature.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  {feature.isRestored ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Restored
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/60">{feature.description}</p>
                
                <div className="text-xs text-white/40">
                  <div className="flex justify-between">
                    <span>Files:</span>
                    <span>{feature.files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tables:</span>
                    <span>{feature.tables.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Archived:</span>
                    <span>{feature.archivedDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-3">
                    <strong>Reason:</strong> {feature.reason}
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={feature.isRestored}
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {feature.isRestored ? 'Already Restored' : 'Restore Feature'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1a2e] border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-white">Restore {feature.name}?</DialogTitle>
                        <DialogDescription className="text-white/60">
                          This will re-enable the feature by adding routes and components back to the active codebase.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-white/80 font-medium mb-2">Files to restore:</p>
                          <ul className="text-xs text-white/50 space-y-1">
                            {feature.files.map((file, i) => (
                              <li key={i}>• {file}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-mansagold hover:bg-mansagold/80 text-black"
                            onClick={() => handleRestore(feature.id)}
                            disabled={restoring === feature.id}
                          >
                            {restoring === feature.id ? (
                              <>Restoring...</>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Confirm Restore
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-gradient-to-br from-mansagold/10 to-amber-600/5 border-mansagold/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-mansagold/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-mansagold" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Why Archive Features?</h4>
              <p className="text-white/60 text-sm">
                Archiving non-essential features reduces bundle size, simplifies maintenance, and lets the team focus on 
                <strong className="text-mansagold"> proving wealth circulation</strong> — the core value proposition. 
                All archived code and data remain intact and can be restored instantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchiveRecovery;
