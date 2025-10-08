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
    // SECURITY: Using DOMPurify for comprehensive XSS protection
    // Validates and sanitizes in one step - no need for separate validation
    const sanitizedContent = sanitizeHtml(htmlContent);
    
    // If content was completely removed by sanitization, show error
    if (!sanitizedContent.trim()) {
      console.warn('Content blocked: HTML contained only unsafe elements');
      return '<p class="text-red-500">Content blocked for security reasons</p>';
    }
    
    // DOMPurify already handles all dangerous content, now just add styling
    // Note: We apply Tailwind classes via CSS rather than manipulating HTML
    return sanitizedContent;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* SECURITY: DOMPurify sanitization applied via sanitizeAndStyleHtml */}
          {/* This is safe to use dangerouslySetInnerHTML because DOMPurify removes all XSS vectors */}
          <div 
            className="prose prose-sm max-w-none document-preview-content"
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
