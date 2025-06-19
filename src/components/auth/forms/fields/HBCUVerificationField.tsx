
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface HBCUVerificationFieldProps {
  isHBCUMember: boolean;
  onHBCUStatusChange: (checked: boolean) => void;
  onFileChange: (file: File | null) => void;
}

const HBCUVerificationField: React.FC<HBCUVerificationFieldProps> = ({
  isHBCUMember,
  onHBCUStatusChange,
  onFileChange
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isHBCUMember"
          checked={isHBCUMember}
          onCheckedChange={onHBCUStatusChange}
        />
        <Label htmlFor="isHBCUMember">
          I am a current HBCU student or alumni
        </Label>
      </div>
      
      {isHBCUMember && (
        <div className="space-y-2">
          <Label htmlFor="hbcuDocument">
            Upload HBCU Verification Document (Student ID, Diploma, etc.)
          </Label>
          <Input
            id="hbcuDocument"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500">
            Upload a student ID, diploma, or other document to verify your HBCU affiliation
          </p>
        </div>
      )}
    </div>
  );
};

export default HBCUVerificationField;
