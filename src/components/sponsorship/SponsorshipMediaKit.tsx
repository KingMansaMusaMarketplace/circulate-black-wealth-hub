
import React, { useState } from 'react';
import { FileText, Award, BarChart3, Share2, TrendingUp, Lock } from 'lucide-react';
import MediaKitCard from './components/MediaKitCard';
import DocumentPreview from './components/DocumentPreview';
import {
  generateBrandAssets,
  generateImpactReport,
  generateMediaKit,
} from './services/pdfGenerationService';
import { AccessRequestModal } from '@/components/media-kit/AccessRequestModal';

type GatedDocumentType = 'partnership_guide' | 'investor_analysis';

const SponsorshipMediaKit = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<GatedDocumentType>('partnership_guide');

  const handlePDFGeneration = async (generatorFunction: () => Promise<void>) => {
    setIsGeneratingPDF(true);
    try {
      await generatorFunction();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleRequestAccess = (documentType: GatedDocumentType) => {
    setSelectedDocument(documentType);
    setAccessModalOpen(true);
  };

  // Public downloads - directly accessible
  const publicMediaKitItems = [
    {
      title: 'Brand Assets',
      description: 'Logo files, brand guidelines, and co-marketing materials',
      icon: Award,
      action: () => handlePDFGeneration(generateBrandAssets),
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Assets'
    },
    {
      title: 'Impact Report',
      description: 'Latest community impact metrics and success stories',
      icon: BarChart3,
      action: () => handlePDFGeneration(generateImpactReport),
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Report'
    },
    {
      title: 'Media Kit',
      description: 'Press releases, fact sheets, and media contact information',
      icon: Share2,
      action: () => handlePDFGeneration(generateMediaKit),
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Kit'
    }
  ];

  // Gated downloads - require access request
  const gatedMediaKitItems: { 
    title: string; 
    description: string; 
    icon: typeof FileText; 
    documentType: GatedDocumentType;
  }[] = [
    {
      title: 'Billion-Dollar Analysis',
      description: 'Full investor analysis with market opportunity, projections, and valuation path',
      icon: TrendingUp,
      documentType: 'investor_analysis'
    },
    {
      title: 'Partnership Guide',
      description: 'Comprehensive overview of partnership opportunities, benefits, and ROI',
      icon: FileText,
      documentType: 'partnership_guide'
    },
  ];

  return (
    <div className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Partnership Resources</h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Download these resources to learn more about our partnership program and share them with your team.
            </p>
          </div>
          
          {/* Public Downloads */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {publicMediaKitItems.map((item, index) => (
              <MediaKitCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onAction={item.action}
                buttonText={item.buttonText}
                isLoading={isGeneratingPDF}
              />
            ))}
          </div>

          {/* Gated Downloads Section */}
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Strategic Documents
              </h3>
              <p className="text-sm text-blue-200/70">
                These documents contain sensitive business information and require approval to access.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {gatedMediaKitItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleRequestAccess(item.documentType)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center flex-shrink-0 relative">
                      <item.icon className="w-6 h-6 text-amber-400" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-blue-200/60 mb-3">{item.description}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 border border-amber-500/50 rounded-full px-3 py-1">
                        <Lock className="w-3 h-3" />
                        Request Access
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {previewDocument && (
            <DocumentPreview
              isOpen={true}
              onClose={() => setPreviewDocument(null)}
              title={previewDocument.title}
              content={previewDocument.content}
            />
          )}

          {/* Access Request Modal */}
          <AccessRequestModal
            isOpen={accessModalOpen}
            onClose={() => setAccessModalOpen(false)}
            documentType={selectedDocument}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorshipMediaKit;
