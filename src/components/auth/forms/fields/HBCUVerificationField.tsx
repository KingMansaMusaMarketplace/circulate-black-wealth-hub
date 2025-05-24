
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Control } from 'react-hook-form';
import { testHBCUVerificationAPI } from '@/lib/api/hbcu-verification';

interface HBCUVerificationFieldProps {
  control: Control<any>;
  isHBCUMember: boolean;
  onHBCUStatusChange: (checked: boolean) => void;
  onFileChange: (file: File | null) => void;
}

const HBCUVerificationField: React.FC<HBCUVerificationFieldProps> = ({
  control,
  isHBCUMember,
  onHBCUStatusChange,
  onFileChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidation, setFileValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const validateFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, message: 'File size must be less than 10MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Only JPEG, PNG, and PDF files are allowed' };
    }

    return { valid: true, message: 'File is valid and ready for upload' };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const validation = validateFile(file);
      setFileValidation(validation);
      
      if (validation.valid) {
        setSelectedFile(file);
        onFileChange(file);
        console.log('Valid file selected:', { name: file.name, size: file.size, type: file.type });
      } else {
        setSelectedFile(null);
        onFileChange(null);
        console.log('Invalid file selected:', validation.message);
      }
    } else {
      setSelectedFile(null);
      onFileChange(null);
      setFileValidation(null);
    }
  };

  const handleTestAPI = async () => {
    setIsTestingAPI(true);
    console.log('Testing HBCU verification API...');
    
    try {
      const result = await testHBCUVerificationAPI();
      console.log('API test result:', result);
      
      if (result) {
        console.log('✅ HBCU verification API is working correctly');
      } else {
        console.log('❌ HBCU verification API test failed');
      }
    } catch (error) {
      console.error('API test error:', error);
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hbcu-member"
          checked={isHBCUMember}
          onCheckedChange={onHBCUStatusChange}
        />
        <label
          htmlFor="hbcu-member"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I am an active student or staff member of a Historically Black College or University (HBCU)
        </label>
      </div>

      {/* Development Testing Button */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTestAPI}
          disabled={isTestingAPI}
          className="text-xs"
        >
          {isTestingAPI ? 'Testing API...' : 'Test HBCU API'}
        </Button>
      )}

      {isHBCUMember && (
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>FREE Membership Available!</strong> Upload verification document to qualify for free membership.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <FormLabel>Verification Document</FormLabel>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mansablue file:text-white hover:file:bg-mansablue-dark"
              />
              <p className="text-xs text-gray-500">
                Upload one of the following: Student ID, Class Schedule, Transcript, Staff ID, or Enrollment Letter (Max 10MB, JPEG/PNG/PDF)
              </p>
              
              {/* File validation feedback */}
              {fileValidation && (
                <Alert variant={fileValidation.valid ? "default" : "destructive"}>
                  {fileValidation.valid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className="text-sm">
                    {fileValidation.message}
                  </AlertDescription>
                </Alert>
              )}
              
              {selectedFile && fileValidation?.valid && (
                <p className="text-sm text-green-600 flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  {selectedFile.name} selected ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Accepted document types:</strong>
              <ul className="list-disc ml-4 mt-1">
                <li>Student ID card (photo)</li>
                <li>Current class schedule or transcript</li>
                <li>Staff employment letter or ID badge</li>
                <li>Official enrollment verification letter</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default HBCUVerificationField;
