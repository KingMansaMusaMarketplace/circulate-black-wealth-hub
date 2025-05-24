
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Upload } from 'lucide-react';
import { Control } from 'react-hook-form';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileChange(file);
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
                Upload one of the following: Student ID, Class Schedule, Transcript, Staff ID, or Enrollment Letter
              </p>
              {selectedFile && (
                <p className="text-sm text-green-600 flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  {selectedFile.name} selected
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
