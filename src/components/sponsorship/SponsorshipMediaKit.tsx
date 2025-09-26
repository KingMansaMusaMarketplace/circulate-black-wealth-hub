
import React, { useState } from 'react';
import { FileText, Award, BarChart3, Share2 } from 'lucide-react';
import MediaKitCard from './components/MediaKitCard';
import DocumentPreview from './components/DocumentPreview';
import {
  generatePartnershipGuide,
  generateBrandAssets,
  generateImpactReport,
  generateMediaKit,
  generateBriefPartnershipOverview
} from './services/pdfGenerationService';
import { getBriefPartnershipOverviewContent } from './templates/briefPartnershipOverviewTemplate';
import { getPartnershipGuideContent } from './templates/partnershipGuideTemplate';

const SponsorshipMediaKit = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handlePDFGeneration = async (generatorFunction: () => Promise<void>) => {
    setIsGeneratingPDF(true);
    try {
      await generatorFunction();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreview = (title: string, content: string) => {
    setPreviewDocument({ title, content });
  };

  const mediaKitItems = [
    {
      title: 'Brief Partnership Overview',
      description: 'Quick 1-page summary of partnership opportunities and benefits',
      icon: FileText,
      action: () => handlePDFGeneration(generateBriefPartnershipOverview),
      onPreview: () => handlePreview('Brief Partnership Overview', getBriefPartnershipOverviewContent()),
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Overview'
    },
    {
      title: 'Partnership Guide',
      description: 'Comprehensive overview of partnership opportunities, benefits, and ROI',
      icon: FileText,
      action: () => handlePDFGeneration(generatePartnershipGuide),
      onPreview: () => handlePreview('Partnership Guide', getPartnershipGuideContent()),
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Guide'
    },
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

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-mansablue">Partnership Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download these resources to learn more about our partnership program and share them with your team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaKitItems.map((item, index) => (
            <MediaKitCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onAction={item.action}
              onPreview={item.onPreview}
              buttonText={item.buttonText}
              isLoading={isGeneratingPDF}
            />
          ))}
        </div>
        
        {previewDocument && (
          <DocumentPreview
            isOpen={true}
            onClose={() => setPreviewDocument(null)}
            title={previewDocument.title}
            content={previewDocument.content}
          />
        )}
      </div>
    </div>
  );
};

export default SponsorshipMediaKit;
