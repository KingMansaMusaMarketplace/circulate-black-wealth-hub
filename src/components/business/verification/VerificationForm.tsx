
import React, { useState } from 'react';
import { useVerification } from '@/hooks/use-verification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface VerificationFormProps {
  businessId: string;
  userId: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ businessId, userId }) => {
  const { verificationStatus, isLoading, error, uploadDocument, submitVerification } = useVerification(businessId, userId);
  
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(51);
  const [registrationDocUrl, setRegistrationDocUrl] = useState<string>('');
  const [ownershipDocUrl, setOwnershipDocUrl] = useState<string>('');
  const [addressDocUrl, setAddressDocUrl] = useState<string>('');
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  
  // Handle document upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'registration' | 'ownership' | 'address') => {
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
      }
    }
    
    setUploadingType(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationDocUrl || !ownershipDocUrl || !addressDocUrl) {
      return; // Don't submit if any document is missing
    }
    
    await submitVerification(ownershipPercentage, registrationDocUrl, ownershipDocUrl, addressDocUrl);
  };
  
  // If already submitted, show status
  if (verificationStatus) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Your business verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium">Status:</h3>
              </div>
              <div>
                {verificationStatus.verification_status === 'pending' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                )}
                {verificationStatus.verification_status === 'approved' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved
                  </span>
                )}
                {verificationStatus.verification_status === 'rejected' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Rejected
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Submitted Documents:</h3>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <div className="flex items-center border p-2 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Business Registration Document</span>
                </div>
                
                <div className="flex items-center border p-2 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Ownership Verification Document</span>
                </div>
                
                <div className="flex items-center border p-2 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Address Verification Document</span>
                </div>
              </div>
            </div>
            
            {verificationStatus.ownership_percentage && (
              <div>
                <h3 className="text-md font-medium">Declared Black Ownership: {verificationStatus.ownership_percentage}%</h3>
              </div>
            )}
            
            <div>
              <h3 className="text-md font-medium">Submitted on: {new Date(verificationStatus.submitted_at).toLocaleDateString()}</h3>
            </div>
            
            {verificationStatus.verification_status === 'rejected' && verificationStatus.rejection_reason && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Rejected</AlertTitle>
                <AlertDescription>
                  {verificationStatus.rejection_reason}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Verification</CardTitle>
        <CardDescription>
          Upload documents to verify your business and confirm Black ownership (51% or more)
        </CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="ownershipPercentage">Black Ownership Percentage</Label>
              <Input
                id="ownershipPercentage"
                type="number"
                min="0"
                max="100"
                value={ownershipPercentage}
                onChange={(e) => setOwnershipPercentage(parseInt(e.target.value, 10))}
                required
              />
              <p className="text-sm text-muted-foreground">
                Please indicate the percentage of your business owned by Black individuals (minimum 51% required for verification)
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Required Documents</h3>
              
              <div className="space-y-2">
                <Label htmlFor="registrationDoc">Business Registration Document</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="registrationDoc"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleUpload(e, 'registration')}
                    disabled={!!registrationDocUrl || uploadingType !== null}
                    className={registrationDocUrl ? "hidden" : ""}
                  />
                  {uploadingType === 'registration' && (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  )}
                  {registrationDocUrl && (
                    <div className="flex items-center bg-green-50 p-2 rounded-md w-full">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="flex-1 text-sm truncate">Document uploaded successfully</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setRegistrationDocUrl('')}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload business registration certificate, LLC documentation, or similar official documents
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownershipDoc">Ownership Verification Document</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="ownershipDoc"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleUpload(e, 'ownership')}
                    disabled={!!ownershipDocUrl || uploadingType !== null}
                    className={ownershipDocUrl ? "hidden" : ""}
                  />
                  {uploadingType === 'ownership' && (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  )}
                  {ownershipDocUrl && (
                    <div className="flex items-center bg-green-50 p-2 rounded-md w-full">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="flex-1 text-sm truncate">Document uploaded successfully</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setOwnershipDocUrl('')}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload shareholder agreements, ownership certificates, or other proof of Black ownership
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressDoc">Address Verification Document</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="addressDoc"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleUpload(e, 'address')}
                    disabled={!!addressDocUrl || uploadingType !== null}
                    className={addressDocUrl ? "hidden" : ""}
                  />
                  {uploadingType === 'address' && (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  )}
                  {addressDocUrl && (
                    <div className="flex items-center bg-green-50 p-2 rounded-md w-full">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="flex-1 text-sm truncate">Document uploaded successfully</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAddressDocUrl('')}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload utility bills, lease agreements, or other proof of business address
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="mt-6 w-full" 
            disabled={isLoading || !registrationDocUrl || !ownershipDocUrl || !addressDocUrl}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
