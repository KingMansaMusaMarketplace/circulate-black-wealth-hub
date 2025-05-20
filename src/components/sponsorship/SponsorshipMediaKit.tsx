
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  MediaKitGrid,
  AgreementDialog,
  ShareDialog,
  PersonalizedProspectusForm
} from './media-kit';

const SponsorshipMediaKit = () => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showPersonalizedForm, setShowPersonalizedForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Function to handle document downloads
  const handleDownload = (documentTitle: string, action?: string) => {
    if (action === "view-agreement") {
      setShowAgreement(true);
      return;
    }
    
    if (action === "personalize-prospectus") {
      setShowPersonalizedForm(true);
      return;
    }
    
    // In a real implementation, this would download actual files
    console.log(`Downloading ${documentTitle}`);
    
    // For demonstration purposes, we'll show a toast
    toast.success(`The ${documentTitle} would download now. In production, this would connect to your document storage system.`);
  };

  // Function to handle document sharing
  const handleShareDocument = () => {
    setShowShareDialog(true);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sponsorship Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download these resources to learn more about our sponsorship program and share them with your team.
          </p>
        </div>
        
        <MediaKitGrid onDownload={handleDownload} />
      </div>
      
      <AgreementDialog 
        open={showAgreement}
        onOpenChange={setShowAgreement}
        onShare={handleShareDocument}
      />

      <PersonalizedProspectusForm
        open={showPersonalizedForm}
        onOpenChange={setShowPersonalizedForm}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </div>
  );
};

export default SponsorshipMediaKit;
