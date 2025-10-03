import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { sanitizeHtml, validateSafeHTML } from '@/lib/security/content-sanitizer';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  const sanitizeAndStyleHtml = (htmlContent: string) => {
    // First validate that the content is safe
    if (!validateSafeHTML(htmlContent)) {
      console.warn('Potentially unsafe HTML content detected and blocked');
      return '<p class="text-red-500">Content blocked for security reasons</p>';
    }
    
    // Sanitize the HTML content
    const sanitizedContent = sanitizeHtml(htmlContent);
    
    // Apply styling to sanitized content
    return sanitizedContent
      .replace(/<div/g, '<div className="mb-4"')
      .replace(/<h1/g, '<h1 className="text-3xl font-bold text-primary mb-6"')
      .replace(/<h2/g, '<h2 className="text-2xl font-semibold text-secondary mb-4"')
      .replace(/<h3/g, '<h3 className="text-xl font-semibold text-primary mb-3"')
      .replace(/<h4/g, '<h4 className="text-lg font-medium text-secondary mb-2"')
      .replace(/<p/g, '<p className="text-foreground mb-3 leading-relaxed"')
      .replace(/<ul/g, '<ul className="list-disc pl-6 mb-3 space-y-1"')
      .replace(/<li/g, '<li className="text-foreground"');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeAndStyleHtml(content)
            }} 
          />
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
