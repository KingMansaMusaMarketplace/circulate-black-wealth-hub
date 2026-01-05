import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, CheckCircle, Plus, Trash2, ExternalLink } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  verified: boolean;
}

interface SocialVerificationProps {
  businessId: string;
  socialLinks: SocialLink[];
  onLinksChange: (links: SocialLink[]) => void;
}

const PLATFORMS = [
  { id: 'website', label: 'Business Website', placeholder: 'https://yourbusiness.com' },
  { id: 'facebook', label: 'Facebook Page', placeholder: 'https://facebook.com/yourbusiness' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbusiness' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbusiness' },
  { id: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourbusiness' },
  { id: 'yelp', label: 'Yelp', placeholder: 'https://yelp.com/biz/yourbusiness' },
  { id: 'google', label: 'Google Business', placeholder: 'https://g.page/yourbusiness' },
];

const SocialVerification: React.FC<SocialVerificationProps> = ({
  businessId,
  socialLinks,
  onLinksChange
}) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addLink = () => {
    if (!newPlatform || !newUrl) return;
    
    // Validate URL
    try {
      new URL(newUrl);
    } catch {
      return;
    }

    const updatedLinks = [
      ...socialLinks,
      { platform: newPlatform, url: newUrl, verified: false }
    ];
    onLinksChange(updatedLinks);
    setNewPlatform('');
    setNewUrl('');
  };

  const removeLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    onLinksChange(updatedLinks);
  };

  const selectedPlatform = PLATFORMS.find(p => p.id === newPlatform);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Social & Web Presence</CardTitle>
            <CardDescription>
              Add links to verify your business's online presence
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-muted/50">
          <AlertDescription className="text-sm">
            Adding your business's social media and website helps verify your identity. 
            Our team will check that these profiles match your business information.
          </AlertDescription>
        </Alert>

        {/* Existing links */}
        {socialLinks.length > 0 && (
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{link.platform}</p>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  {link.verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new link */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Platform</Label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select platform...</option>
                {PLATFORMS.filter(p => !socialLinks.some(l => l.platform === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={selectedPlatform?.placeholder || 'https://...'}
              />
            </div>
          </div>
          
          <Button 
            onClick={addLink} 
            variant="outline" 
            size="sm"
            disabled={!newPlatform || !newUrl}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Add at least one verified online presence to strengthen your verification application.
        </p>
      </CardContent>
    </Card>
  );
};

export default SocialVerification;
