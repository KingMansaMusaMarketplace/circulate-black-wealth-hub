import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface CertificationAgreementProps {
  isAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  ownerName: string;
}

const CertificationAgreement: React.FC<CertificationAgreementProps> = ({
  isAccepted,
  onAcceptChange,
  ownerName,
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-amber-500/10 border-amber-500/30">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Black-Owned Business Certification</strong>
          <p className="mt-1 text-sm">
            Mansa Musa Marketplace is committed to supporting authentic Black-owned businesses. 
            Please carefully read and accept the certification agreement below.
          </p>
        </AlertDescription>
      </Alert>

      <div className="border rounded-lg p-4 bg-muted/30 space-y-3 text-sm">
        <h4 className="font-semibold text-base">Certification Agreement</h4>
        
        <p>I, <strong>{ownerName || '[Owner Name]'}</strong>, hereby certify and attest that:</p>
        
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            The business for which I am seeking certification is <strong>at least 51% owned</strong> by 
            one or more individuals who identify as Black or African American.
          </li>
          <li>
            The Black owner(s) exercise <strong>operational and managerial control</strong> over the 
            business's daily operations and long-term decision making.
          </li>
          <li>
            All documents submitted for verification are <strong>authentic and accurate</strong>, and 
            I have the legal authority to submit them on behalf of the business.
          </li>
          <li>
            I understand that providing false information may result in <strong>immediate removal</strong> 
            from the Mansa Musa Marketplace platform and potential legal action.
          </li>
          <li>
            I agree to <strong>notify Mansa Musa Marketplace</strong> within 30 days if there are any 
            changes to the ownership structure that would affect the 51% Black ownership requirement.
          </li>
          <li>
            I consent to Mansa Musa Marketplace <strong>verifying the information</strong> provided 
            through third-party sources if necessary.
          </li>
        </ol>

        <div className="pt-2 border-t mt-4">
          <p className="text-xs text-muted-foreground">
            This certification is valid for one (1) year from the date of approval and may require 
            re-verification upon expiration.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 p-4 border rounded-lg bg-background">
        <Checkbox
          id="certification-agreement"
          checked={isAccepted}
          onCheckedChange={(checked) => onAcceptChange(checked === true)}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label 
            htmlFor="certification-agreement" 
            className="text-sm font-medium cursor-pointer"
          >
            I certify under penalty of perjury that all statements above are true and correct
          </Label>
          <p className="text-xs text-muted-foreground">
            By checking this box, you acknowledge that you have read, understand, and agree to the 
            certification requirements. Your IP address and the date/time of acceptance will be recorded.
          </p>
        </div>
      </div>

      {!isAccepted && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You must accept the certification agreement to submit your verification request.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CertificationAgreement;
