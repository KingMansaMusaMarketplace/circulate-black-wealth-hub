import React, { useRef, useState } from 'react';
import { Upload, CheckCircle2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadDriverDocument, DriverDocumentType, DOCUMENT_LABELS } from '@/lib/api/noir-driver-api';
import { toast } from 'sonner';

interface Props {
  userId: string;
  driverId: string;
  documentType: DriverDocumentType;
  existingUrl?: string | null;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  onUploaded?: () => void;
}

const DocumentUploader: React.FC<Props> = ({
  userId, driverId, documentType, existingUrl, reviewStatus, onUploaded,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large (max 10MB)');
      return;
    }
    setUploading(true);
    try {
      await uploadDriverDocument(userId, driverId, documentType, file);
      toast.success(`Uploaded: ${DOCUMENT_LABELS[documentType]}`);
      onUploaded?.();
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const hasFile = !!existingUrl;
  const statusBadge = reviewStatus === 'approved'
    ? <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</span>
    : reviewStatus === 'rejected'
    ? <span className="text-red-400 text-xs flex items-center gap-1"><X className="h-3 w-3" /> Rejected — please re-upload</span>
    : hasFile
    ? <span className="text-yellow-400 text-xs">Pending review</span>
    : <span className="text-white/40 text-xs">Required</span>;

  return (
    <div className={`rounded-lg border p-4 ${hasFile ? 'border-mansagold/30 bg-mansagold/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium">{DOCUMENT_LABELS[documentType]}</div>
          <div className="mt-1">{statusBadge}</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFile}
          className="hidden"
          disabled={uploading}
        />
        <Button
          size="sm"
          variant={hasFile ? 'outline' : 'default'}
          onClick={() => inputRef.current?.click()}
          disabled={uploading || reviewStatus === 'approved'}
          className={hasFile ? '' : 'bg-mansagold text-slate-900 hover:bg-mansagold/90'}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" />
            : <><Upload className="h-4 w-4 mr-1" />{hasFile ? 'Replace' : 'Upload'}</>}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
