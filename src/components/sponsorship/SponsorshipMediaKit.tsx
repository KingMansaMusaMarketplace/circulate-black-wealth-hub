
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Users, BarChart3, FilePen, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SponsorshipAgreement from './SponsorshipAgreement';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SponsorshipMediaKit = () => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showPersonalizedForm, setShowPersonalizedForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  
  const mediaKitItems = [
    {
      icon: <FileText className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Prospectus",
      description: "Complete details about our sponsorship tiers, benefits, and impact metrics.",
      buttonText: "Download PDF",
      action: "personalize-prospectus"
    },
    {
      icon: <FilePen className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Agreement",
      description: "Our detailed legal agreement outlining terms, conditions, and cancellation policies.",
      buttonText: "View Agreement",
      action: "view-agreement"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-mansablue" />,
      title: "Impact Report",
      description: "Our latest data on economic circulation and community impact.",
      buttonText: "Download Report"
    },
    {
      icon: <Users className="h-8 w-8 text-mansablue" />,
      title: "Audience Demographics",
      description: "Detailed information about our community members and their engagement.",
      buttonText: "View Demographics"
    },
    {
      icon: <Shield className="h-8 w-8 text-mansablue" />,
      title: "Legal Compliance Guide",
      description: "Guidelines on regulatory compliance and ethical considerations for partnerships.",
      buttonText: "Download Guide"
    }
  ];

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
    
    // For demonstration purposes, we'll show an alert
    toast.success(`The ${documentTitle} would download now. In production, this would connect to your document storage system.`);
  };

  const handlePersonalizedDownload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would generate a custom PDF with the company name
    console.log(`Generating personalized prospectus for ${companyName}`);
    
    // Show success message and close the dialog
    toast.success(`Your personalized Sponsorship Prospectus has been created and will download shortly for ${companyName}.`);
    
    // Reset form and close dialog
    setCompanyName('');
    setContactName('');
    setEmail('');
    setShowPersonalizedForm(false);
    
    // Simulate download after a short delay to show the toast
    setTimeout(() => {
      toast(`In a production environment, a customized PDF with ${companyName}'s branding would be generated.`);
    }, 1500);
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mediaKitItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm h-full">
              <div className="mb-4 bg-white p-3 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{item.description}</p>
              <Button 
                className="bg-mansablue hover:bg-mansablue-dark"
                onClick={() => handleDownload(item.title, item.action)}
              >
                <Download className="h-4 w-4 mr-2" />
                {item.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sponsorship Agreement</DialogTitle>
          </DialogHeader>
          <SponsorshipAgreement />
        </DialogContent>
      </Dialog>

      {/* Personalized Prospectus Form Dialog */}
      <Dialog open={showPersonalizedForm} onOpenChange={setShowPersonalizedForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center mb-2">Customize Your Sponsorship Prospectus</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePersonalizedDownload} className="space-y-4 py-2">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company, Inc." 
                required
              />
            </div>
            <div>
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input 
                id="contact-name" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="John Doe" 
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com" 
                required
              />
            </div>
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-mansablue hover:bg-mansablue-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Personalized Prospectus
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500">
              We'll create a custom sponsorship document with your company's details to share with your team.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorshipMediaKit;
