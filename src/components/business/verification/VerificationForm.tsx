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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CertificationAgreement from './CertificationAgreement';
import CertificateDownload from './CertificateDownload';
import PhoneVerification from './PhoneVerification';
import VideoVerification from './VideoVerification';
import SocialVerification from './SocialVerification';
import VerificationMethodSelector, { VerificationMethod } from './VerificationMethodSelector';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import { BadgeTier } from '@/lib/types/verification';

interface VerificationFormProps {
  businessId: string;
  userId: string;
  businessName?: string;
  businessPhone?: string;
}

type DocumentType = 'registration' | 'ownership' | 'address' | 'identity' | 'license';

interface SocialLink {
  platform: string;
  url: string;
  verified: boolean;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ businessId, userId, businessName, businessPhone }) => {
  const { verificationStatus, isLoading, error, uploadDocument, submitVerification, refreshStatus } = useVerification(businessId, userId);
  const { user } = useAuth();
  
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('documents');
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
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
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
  
  // Check if ready to submit based on method
  const canSubmit = () => {
    if (!certificationAccepted || !ownerLegalName) return false;
    
    switch (verificationMethod) {
      case 'documents':
        return allRequiredDocsUploaded;
      case 'phone':
        return phoneVerified;
      case 'video':
        return !!videoUrl;
      case 'combined':
        return allRequiredDocsUploaded && phoneVerified && !!videoUrl;
      default:
        return false;
    }
  };

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
            
            {/* Step 2: Choose Verification Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Verification Method
              </h3>
              
              <VerificationMethodSelector
                selectedMethod={verificationMethod}
                onMethodChange={setVerificationMethod}
                phoneVerified={phoneVerified}
                videoSubmitted={!!videoUrl}
                documentsUploaded={!!allRequiredDocsUploaded}
              />
            </div>
            
            <Separator />
            
            {/* Step 3: Complete Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Complete Verification
              </h3>
              
              <Tabs value={verificationMethod === 'combined' ? 'documents' : verificationMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="documents"
                    disabled={verificationMethod !== 'documents' && verificationMethod !== 'combined'}
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phone"
                    disabled={verificationMethod !== 'phone' && verificationMethod !== 'combined'}
                  >
                    Phone
                  </TabsTrigger>
                  <TabsTrigger 
                    value="video"
                    disabled={verificationMethod !== 'video' && verificationMethod !== 'combined'}
                  >
                    Video
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="space-y-4 mt-4">
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
                </TabsContent>
                
                <TabsContent value="phone" className="mt-4">
                  <PhoneVerification
                    businessId={businessId}
                    userId={userId}
                    businessPhone={businessPhone}
                    isVerified={phoneVerified}
                    onVerified={() => {
                      setPhoneVerified(true);
                      refreshStatus();
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="video" className="mt-4">
                  <VideoVerification
                    businessId={businessId}
                    userId={userId}
                    businessName={businessName || 'Your Business'}
                    isVerified={!!videoUrl}
                    videoUrl={videoUrl}
                    onVideoUploaded={setVideoUrl}
                  />
                </TabsContent>
              </Tabs>
              
              {verificationMethod === 'combined' && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Combined Verification Progress</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {allRequiredDocsUploaded ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={allRequiredDocsUploaded ? 'text-green-600' : ''}>
                        Document Verification
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {phoneVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={phoneVerified ? 'text-green-600' : ''}>
                        Phone Verification
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {videoUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={videoUrl ? 'text-green-600' : ''}>
                        Video Verification
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Step 4: Social Verification (Optional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
                Social Verification
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </h3>
              
              <SocialVerification
                businessId={businessId}
                socialLinks={socialLinks}
                onLinksChange={setSocialLinks}
              />
            </div>
            
            <Separator />
            
            {/* Step 5: Certification Agreement */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">5</span>
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
            disabled={isLoading || !canSubmit()}
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
