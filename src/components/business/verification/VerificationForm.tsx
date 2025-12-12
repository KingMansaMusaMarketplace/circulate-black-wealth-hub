import React, { useState } from 'react';
import { useVerification } from '@/hooks/use-verification';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CertificationAgreement from './CertificationAgreement';
import CertificateDownload from './CertificateDownload';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import { BadgeTier } from '@/lib/types/verification';

interface VerificationFormProps {
  businessId: string;
  userId: string;
  businessName?: string;
}

type DocumentType = 'registration' | 'ownership' | 'address' | 'identity' | 'license';

const VerificationForm: React.FC<VerificationFormProps> = ({ businessId, userId, businessName }) => {
  const { verificationStatus, isLoading, error, uploadDocument, submitVerification } = useVerification(businessId, userId);
  const { user } = useAuth();
  
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(51);
  const [ownerLegalName, setOwnerLegalName] = useState<string>(user?.user_metadata?.full_name || '');
  const [registrationDocUrl, setRegistrationDocUrl] = useState<string>('');
  const [ownershipDocUrl, setOwnershipDocUrl] = useState<string>('');
  const [addressDocUrl, setAddressDocUrl] = useState<string>('');
  const [identityDocUrl, setIdentityDocUrl] = useState<string>('');
  const [licenseDocUrl, setLicenseDocUrl] = useState<string>('');
  const [certificationAccepted, setCertificationAccepted] = useState<boolean>(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Handle document upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingType(type);
    
    const url = await uploadDocument(file, type);
    
    if (url) {
      switch (type) {
        case 'registration':
          setRegistrationDocUrl(url);
          break;
        case 'ownership':
          setOwnershipDocUrl(url);
          break;
        case 'address':
          setAddressDocUrl(url);
          break;
        case 'identity':
          setIdentityDocUrl(url);
          break;
        case 'license':
          setLicenseDocUrl(url);
          break;
      }
    }
    
    setUploadingType(null);
  };
  
  // Check if all required documents are uploaded
  const allRequiredDocsUploaded = registrationDocUrl && ownershipDocUrl && addressDocUrl && identityDocUrl;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allRequiredDocsUploaded || !certificationAccepted) {
      return;
    }
    
    await submitVerification(
      ownershipPercentage, 
      registrationDocUrl, 
      ownershipDocUrl, 
      addressDocUrl,
      identityDocUrl,
      licenseDocUrl,
      certificationAccepted,
      ownerLegalName
    );
  };

  // If approved with certificate, show certificate download
  if (verificationStatus?.verification_status === 'approved' && verificationStatus?.certificate_number) {
    return (
      <CertificateDownload
        businessName={businessName || 'Your Business'}
        certificateNumber={verificationStatus.certificate_number}
        expiresAt={verificationStatus.certification_expires_at || ''}
        badgeTier={(verificationStatus.badge_tier as BadgeTier) || 'certified'}
        verifiedAt={verificationStatus.verified_at || ''}
      />
    );
  }

  // If already submitted, show status
  if (verificationStatus) {
    const isPending = verificationStatus.verification_status === 'pending';
    const isRejected = verificationStatus.verification_status === 'rejected';
    const isApproved = verificationStatus.verification_status === 'approved';
    
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your Black-Owned Business certification status</CardDescription>
            </div>
            <VerifiedBlackOwnedBadge
              tier={isPending ? 'verified' : isApproved ? 'certified' : 'basic'}
              variant="standard"
              isPending={isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Ownership</p>
                <p className="font-semibold">{verificationStatus.ownership_percentage}% Black-Owned</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-semibold">{new Date(verificationStatus.submitted_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Documents Submitted:</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'Business Registration', url: verificationStatus.registration_document_url },
                  { label: 'Ownership Verification', url: verificationStatus.ownership_document_url },
                  { label: 'Address Verification', url: verificationStatus.address_document_url },
                  { label: 'Government-Issued ID', url: (verificationStatus as any).identity_document_url },
                  { label: 'Business License', url: (verificationStatus as any).business_license_url },
                ].filter(doc => doc.url).map((doc, i) => (
                  <div key={i} className="flex items-center border p-2 rounded-md bg-background">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{doc.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {isRejected && verificationStatus.rejection_reason && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Rejected</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>{verificationStatus.rejection_reason}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Reset form for resubmission */}}
                    className="mt-2"
                  >
                    Resubmit Verification
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {isPending && (
              <Alert className="bg-amber-500/10 border-amber-500/30">
                <Shield className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Your verification is under review. This typically takes 24-48 hours. 
                  You'll be notified once your certification is approved.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Document upload helper component
  const DocumentUploadField = ({ 
    id, 
    label, 
    description, 
    type, 
    url, 
    setUrl, 
    required = true 
  }: { 
    id: string; 
    label: string; 
    description: string; 
    type: DocumentType; 
    url: string; 
    setUrl: (url: string) => void;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={id}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleUpload(e, type)}
          disabled={!!url || uploadingType !== null}
          className={url ? "hidden" : ""}
        />
        {uploadingType === type && (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Uploading...</span>
          </div>
        )}
        {url && (
          <div className="flex items-center bg-green-500/10 border border-green-500/30 p-2 rounded-md w-full">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="flex-1 text-sm truncate">Document uploaded</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setUrl('')}
            >
              Change
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Shield className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle>Certified Black-Owned Business</CardTitle>
            <CardDescription>
              Complete verification to receive your official certification badge
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {/* Step 1: Owner Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                Owner Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerLegalName">Owner's Legal Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="ownerLegalName"
                    type="text"
                    value={ownerLegalName}
                    onChange={(e) => setOwnerLegalName(e.target.value)}
                    placeholder="Enter your full legal name"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must match your government-issued ID
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownershipPercentage">Black Ownership Percentage <span className="text-destructive">*</span></Label>
                  <Input
                    id="ownershipPercentage"
                    type="number"
                    min="51"
                    max="100"
                    value={ownershipPercentage}
                    onChange={(e) => setOwnershipPercentage(parseInt(e.target.value, 10))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 51% required for certification
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Step 2: Required Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Required Documents
              </h3>
              
              <DocumentUploadField
                id="identityDoc"
                label="Government-Issued Photo ID"
                description="Driver's license, passport, or state ID showing your legal name"
                type="identity"
                url={identityDocUrl}
                setUrl={setIdentityDocUrl}
              />
              
              <DocumentUploadField
                id="registrationDoc"
                label="Business Registration Document"
                description="Business registration certificate, LLC documentation, or articles of incorporation"
                type="registration"
                url={registrationDocUrl}
                setUrl={setRegistrationDocUrl}
              />
              
              <DocumentUploadField
                id="ownershipDoc"
                label="Ownership Verification Document"
                description="Shareholder agreements, operating agreements, or ownership certificates showing 51%+ Black ownership"
                type="ownership"
                url={ownershipDocUrl}
                setUrl={setOwnershipDocUrl}
              />
              
              <DocumentUploadField
                id="addressDoc"
                label="Address Verification Document"
                description="Utility bill, lease agreement, or official correspondence showing business address"
                type="address"
                url={addressDocUrl}
                setUrl={setAddressDocUrl}
              />
              
              <DocumentUploadField
                id="licenseDoc"
                label="Business License/Permit"
                description="Business license, permit, or professional certification (if applicable)"
                type="license"
                url={licenseDocUrl}
                setUrl={setLicenseDocUrl}
                required={false}
              />
            </div>
            
            <Separator />
            
            {/* Step 3: Certification Agreement */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Certification Agreement
              </h3>
              
              <CertificationAgreement
                isAccepted={certificationAccepted}
                onAcceptChange={setCertificationAccepted}
                ownerName={ownerLegalName}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="mt-6 w-full gap-2" 
            disabled={isLoading || !allRequiredDocsUploaded || !certificationAccepted || !ownerLegalName}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Submit for Certification
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            Verification typically takes 24-48 business hours. You'll receive an email once your certification is approved.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
