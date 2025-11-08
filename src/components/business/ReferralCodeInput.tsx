import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { validateReferralCode } from '@/lib/api/referral-tracking-api';
import { toast } from 'sonner';

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean, agentName?: string) => void;
}

const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({
  value,
  onChange,
  onValidate
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    isValid?: boolean;
    agentName?: string;
    error?: string;
  }>({});

  const handleValidate = async () => {
    if (!value.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateReferralCode(value.trim().toUpperCase());
      
      if (result.valid) {
        setValidationStatus({
          isValid: true,
          agentName: result.agent_name
        });
        toast.success(`Valid code from agent: ${result.agent_name}`);
        onValidate?.(true, result.agent_name);
      } else {
        setValidationStatus({
          isValid: false,
          error: result.error
        });
        toast.error(result.error || 'Invalid referral code');
        onValidate?.(false);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus({
        isValid: false,
        error: 'Failed to validate code'
      });
      toast.error('Failed to validate referral code');
      onValidate?.(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    // Reset validation status when input changes
    setValidationStatus({});
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referral-code" className="text-sm font-medium">
        Referral Code (Optional)
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="referral-code"
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter agent referral code"
            className="uppercase"
            maxLength={20}
          />
          {validationStatus.isValid !== undefined && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validationStatus.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={handleValidate}
          disabled={isValidating || !value.trim()}
          variant="outline"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Validate'
          )}
        </Button>
      </div>
      {validationStatus.isValid && validationStatus.agentName && (
        <p className="text-sm text-green-600">
          ✓ Referred by: {validationStatus.agentName}
        </p>
      )}
      {validationStatus.isValid === false && validationStatus.error && (
        <p className="text-sm text-red-600">
          {validationStatus.error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Have a referral code from a sales agent? Enter it here to give them credit for your sign-up.
      </p>
    </div>
  );
};

export default ReferralCodeInput;
