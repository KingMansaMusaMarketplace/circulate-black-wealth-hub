
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalizedProspectusFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PersonalizedProspectusForm: React.FC<PersonalizedProspectusFormProps> = ({ open, onOpenChange }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');

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
    onOpenChange(false);
    
    // Simulate download after a short delay to show the toast
    setTimeout(() => {
      toast(`In a production environment, a customized PDF with ${companyName}'s branding would be generated.`);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default PersonalizedProspectusForm;
