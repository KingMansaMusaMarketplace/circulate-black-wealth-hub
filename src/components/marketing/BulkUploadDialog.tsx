import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { createMarketingMaterial } from '@/lib/api/marketing-materials-api';
import { MaterialType } from '@/types/marketing-material';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CSVRow {
  title: string;
  description: string;
  type: string;
  dimensions?: string;
  fileName?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{ success: number; failed: number } | null>(null);

  const downloadTemplate = () => {
    const template = `title,description,type,dimensions,fileName
Hero Banner - Blue,Main promotional banner with Mansa Musa branding,banner,1200x628px,hero-banner.png
Instagram Story,Eye-catching story template,social,1080x1920px,insta-story.png
Email Template,Introduction email for businesses,email,,email-intro.html`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-materials-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVRow[];
        setParsedData(data);
        validateData(data);
      },
      error: (error) => {
        toast.error('Failed to parse CSV file');
        console.error(error);
      }
    });
  };

  const validateData = (data: CSVRow[]) => {
    const validationErrors: ValidationError[] = [];
    const validTypes = ['banner', 'social', 'email', 'document'];

    data.forEach((row, index) => {
      if (!row.title?.trim()) {
        validationErrors.push({
          row: index + 1,
          field: 'title',
          message: 'Title is required'
        });
      }

      if (!row.type?.trim()) {
        validationErrors.push({
          row: index + 1,
          field: 'type',
          message: 'Type is required'
        });
      } else if (!validTypes.includes(row.type.toLowerCase())) {
        validationErrors.push({
          row: index + 1,
          field: 'type',
          message: `Type must be one of: ${validTypes.join(', ')}`
        });
      }
    });

    setErrors(validationErrors);
  };

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const findFileForRow = (row: CSVRow): File | undefined => {
    if (!row.fileName) return undefined;
    return files.find(f => f.name === row.fileName.trim());
  };

  const handleBulkUpload = async () => {
    if (errors.length > 0) {
      toast.error('Please fix validation errors before uploading');
      return;
    }

    if (parsedData.length === 0) {
      toast.error('No data to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      
      try {
        const file = findFileForRow(row);
        
        await createMarketingMaterial({
          title: row.title.trim(),
          description: row.description?.trim() || '',
          type: row.type.toLowerCase() as MaterialType,
          dimensions: row.dimensions?.trim() || undefined,
          file: file
        });

        successCount++;
      } catch (error) {
        console.error(`Failed to upload row ${i + 1}:`, error);
        failedCount++;
      }

      setUploadProgress(Math.round(((i + 1) / parsedData.length) * 100));
    }

    setUploadResults({ success: successCount, failed: failedCount });
    setUploading(false);

    if (failedCount === 0) {
      toast.success(`Successfully uploaded ${successCount} materials`);
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 2000);
    } else {
      toast.warning(`Uploaded ${successCount} materials, ${failedCount} failed`);
    }
  };

  const handleClose = () => {
    setCsvFile(null);
    setFiles([]);
    setParsedData([]);
    setErrors([]);
    setUploadProgress(0);
    setUploadResults(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Marketing Materials</DialogTitle>
          <DialogDescription>
            Upload multiple materials at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">Download CSV Template</h4>
                <p className="text-sm text-muted-foreground">
                  Start with our template to ensure correct formatting
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {/* CSV Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">1. Upload CSV File</label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                disabled={uploading}
                className="flex-1"
              />
              {csvFile && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            {csvFile && (
              <p className="text-sm text-muted-foreground">
                {parsedData.length} materials found in CSV
              </p>
            )}
          </div>

          {/* Files Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">2. Upload Files (Optional)</label>
            <Input
              type="file"
              multiple
              onChange={handleFilesUpload}
              disabled={uploading}
              accept="image/*,.pdf,.doc,.docx"
            />
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Tip: File names in CSV should match the uploaded file names
            </p>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors ({errors.length})</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm max-h-32 overflow-y-auto">
                  {errors.slice(0, 5).map((error, idx) => (
                    <li key={idx}>
                      Row {error.row}, {error.field}: {error.message}
                    </li>
                  ))}
                  {errors.length > 5 && (
                    <li className="text-muted-foreground">
                      ...and {errors.length - 5} more errors
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {parsedData.length > 0 && errors.length === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Ready to Upload</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>• {parsedData.length} materials will be created</p>
                  <p>• {parsedData.filter(r => r.fileName).length} will have files attached</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Files without matching names will be created without attachments
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading materials...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Upload Results */}
          {uploadResults && !uploading && (
            <Alert variant={uploadResults.failed === 0 ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Upload Complete</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-green-600">✓ {uploadResults.success} materials uploaded successfully</p>
                  {uploadResults.failed > 0 && (
                    <p className="text-red-600">✗ {uploadResults.failed} materials failed</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            {uploadResults ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResults && (
            <Button
              onClick={handleBulkUpload}
              disabled={uploading || parsedData.length === 0 || errors.length > 0}
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {parsedData.length} Materials
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add missing Input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
    />
  );
};

export default BulkUploadDialog;
