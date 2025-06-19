
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SalesAgent } from '@/types/sales-agent';

interface ReferralCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  referringAgent: SalesAgent | null;
}

const ReferralCodeField: React.FC<ReferralCodeFieldProps> = ({ 
  value,
  onChange,
  onBlur,
  referringAgent
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode">Referral Code (Optional)</Label>
      <Input
        id="referralCode"
        placeholder="Enter referral code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {referringAgent && (
        <p className="text-xs text-green-600">Referred by: {referringAgent.full_name}</p>
      )}
    </div>
  );
};

export default ReferralCodeField;
