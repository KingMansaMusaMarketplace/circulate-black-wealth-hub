import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

interface CSVUploaderProps {
  onClose: () => void;
}

interface CSVPreview {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

const REQUIRED_FIELDS = ['business_name'];
const OPTIONAL_FIELDS = [
  'business_description',
  'category', 
  'owner_name',
  'owner_email',
  'phone_number',
  'website_url',
  'city',
  'state',
  'zip_code',
  'location'
];

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onClose }) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'processing'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CSVPreview | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);

    // Parse CSV to get headers and preview
    Papa.parse(selectedFile, {
      preview: 6, // Get first 6 rows (1 header + 5 data)
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length < 2) {
          toast.error('CSV file appears to be empty');
          return;
        }

        setCsvPreview({
          headers: data[0],
          rows: data.slice(1, 6),
          totalRows: 0, // Will be updated
        });

        // Auto-map fields if headers match
        const autoMapping: Record<string, string> = {};
        data[0].forEach((header) => {
          const normalizedHeader = header.toLowerCase().replace(/[^a-z]/g, '_');
          if ([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].includes(normalizedHeader)) {
            autoMapping[normalizedHeader] = header;
          }
        });
        setFieldMapping(autoMapping);
        setStep('mapping');
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
      },
    });

    // Get total row count
    Papa.parse(selectedFile, {
      complete: (results) => {
        setCsvPreview(prev => prev ? { ...prev, totalRows: results.data.length - 1 } : null);
      },
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith('.csv')) {
      const input = document.createElement('input');
      input.type = 'file';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      input.files = dataTransfer.files;
      handleFileSelect({ target: input } as any);
    } else {
      toast.error('Please drop a CSV file');
    }
  }, [handleFileSelect]);

  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    // Treat __skip__ as empty/unmapped
    const mappedValue = sourceColumn === '__skip__' ? '' : sourceColumn;
    setFieldMapping(prev => ({
      ...prev,
      [targetField]: mappedValue,
    }));
  };

  const handleImport = async () => {
    if (!file || !fieldMapping.business_name) {
      toast.error('Business name mapping is required');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Parse the full CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data as Record<string, string>[];
          
          // Transform rows based on field mapping
          const leads = rows.map(row => ({
            business_name: row[fieldMapping.business_name] || '',
            business_description: fieldMapping.business_description ? row[fieldMapping.business_description] : null,
            category: fieldMapping.category ? row[fieldMapping.category] : null,
            owner_name: fieldMapping.owner_name ? row[fieldMapping.owner_name] : null,
            owner_email: fieldMapping.owner_email ? row[fieldMapping.owner_email] : null,
            phone_number: fieldMapping.phone_number ? row[fieldMapping.phone_number] : null,
            website_url: fieldMapping.website_url ? row[fieldMapping.website_url] : null,
            city: fieldMapping.city ? row[fieldMapping.city] : null,
            state: fieldMapping.state ? row[fieldMapping.state] : null,
            zip_code: fieldMapping.zip_code ? row[fieldMapping.zip_code] : null,
            location: fieldMapping.location ? row[fieldMapping.location] : null,
            source_query: 'csv_import',
          })).filter(lead => lead.business_name.trim() !== '');

          if (leads.length === 0) {
            toast.error('No valid leads found in CSV');
            setStep('mapping');
            setIsProcessing(false);
            return;
          }

          // Insert into database in batches
          const batchSize = 100;
          let successCount = 0;
          let errorCount = 0;

          for (let i = 0; i < leads.length; i += batchSize) {
            const batch = leads.slice(i, i + batchSize);
            const { error } = await supabase
              .from('b2b_external_leads')
              .insert(batch);

            if (error) {
              console.error('Batch insert error:', error);
              errorCount += batch.length;
            } else {
              successCount += batch.length;
            }
          }

          if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} leads!`);
          }
          if (errorCount > 0) {
            toast.error(`Failed to import ${errorCount} leads`);
          }
          
          onClose();
        },
        error: (error) => {
          toast.error(`Failed to parse CSV: ${error.message}`);
          setStep('mapping');
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to start import');
      setStep('mapping');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Import Businesses from CSV</DialogTitle>
          <DialogDescription className="text-blue-200">
            Upload a CSV file containing business information to add to your leads database.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-purple-400/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('csv-input')?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <p className="text-lg font-medium text-white mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-blue-200">
                or click to browse
              </p>
              <input
                id="csv-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Required fields:</strong> business_name
                <br />
                <strong>Recommended:</strong> owner_email, city, state, category
              </p>
            </div>
          </motion.div>
        )}

        {step === 'mapping' && csvPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
              <FileText className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium text-white">{file?.name}</p>
                <p className="text-sm text-green-300">{csvPreview.totalRows.toLocaleString()} rows detected</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white">Map CSV Columns to Fields</h4>
              
              {/* Required Fields */}
              <div className="space-y-2">
                <Label className="text-yellow-400 text-xs">Required</Label>
                {REQUIRED_FIELDS.map((field) => (
                  <div key={field} className="flex items-center gap-3">
                    <div className="w-1/3">
                      <Label className="text-blue-200">{field.replace(/_/g, ' ')}</Label>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-300" />
                    <Select
                      value={fieldMapping[field] || ''}
                      onValueChange={(value) => handleMappingChange(field, value)}
                    >
                      <SelectTrigger className="flex-1 bg-white/5 border-white/20">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvPreview.headers.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldMapping[field] && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Optional Fields */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Label className="text-blue-300 text-xs">Optional</Label>
                {OPTIONAL_FIELDS.map((field) => (
                  <div key={field} className="flex items-center gap-3">
                    <div className="w-1/3">
                      <Label className="text-blue-200 text-sm">{field.replace(/_/g, ' ')}</Label>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-300" />
                    <Select
                      value={fieldMapping[field] || ''}
                      onValueChange={(value) => handleMappingChange(field, value)}
                    >
                      <SelectTrigger className="flex-1 bg-white/5 border-white/20 h-9">
                        <SelectValue placeholder="Select column (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__skip__">-- Skip --</SelectItem>
                        {csvPreview.headers.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" onClick={onClose} className="border-white/20">
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!fieldMapping.business_name}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                Start Import
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-white mb-2">Processing Import</p>
            <p className="text-sm text-blue-200">
              Your CSV is being processed. This may take a few minutes.
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
