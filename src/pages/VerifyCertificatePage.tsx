import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Building2, Calendar, Shield } from 'lucide-react';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import { BadgeTier } from '@/lib/types/verification';

interface CertificateData {
  certificate_number: string;
  business_name: string;
  business_id: string;
  issued_at: string;
  expires_at: string;
  is_active: boolean;
  badge_tier: BadgeTier;
}

const VerifyCertificatePage: React.FC = () => {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificateNumber) {
        setError('No certificate number provided');
        setLoading(false);
        return;
      }

      try {
        // Look up the verification by certificate number
        const { data: verification, error: verificationError } = await supabase
          .from('business_verifications')
          .select(`
            certificate_number,
            certification_expires_at,
            verified_at,
            badge_tier,
            verification_status,
            business_id,
            businesses!inner(business_name, id)
          `)
          .eq('certificate_number', certificateNumber)
          .single();

        if (verificationError || !verification) {
          setError('Certificate not found. Please check the certificate number.');
          setLoading(false);
          return;
        }

        const business = Array.isArray(verification.businesses) 
          ? verification.businesses[0] 
          : verification.businesses;

        const isExpired = verification.certification_expires_at 
          ? new Date(verification.certification_expires_at) < new Date() 
          : false;

        setCertificate({
          certificate_number: verification.certificate_number || '',
          business_name: business?.business_name || 'Unknown Business',
          business_id: business?.id || verification.business_id,
          issued_at: verification.verified_at || '',
          expires_at: verification.certification_expires_at || '',
          is_active: verification.verification_status === 'approved' && !isExpired,
          badge_tier: (verification.badge_tier as BadgeTier) || 'certified',
        });
      } catch (err) {
        console.error('Error verifying certificate:', err);
        setError('An error occurred while verifying the certificate.');
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-xl font-bold">Certificate Not Found</h1>
              <p className="text-muted-foreground">
                {error || 'The certificate could not be verified.'}
              </p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = certificate.expires_at 
    ? new Date(certificate.expires_at) < new Date() 
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500/5 via-background to-yellow-500/5 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-amber-500/30">
        <CardHeader className="text-center border-b">
          <div className="mx-auto mb-4">
            <VerifiedBlackOwnedBadge
              tier={certificate.badge_tier}
              variant="detailed"
              certificateNumber={certificate.certificate_number}
              expiresAt={certificate.expires_at}
              isExpired={isExpired}
            />
          </div>
          <CardTitle className="text-2xl">Certificate Verification</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {certificate.is_active ? (
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
                Valid Certificate
              </h2>
              <p className="text-muted-foreground">
                This business has been verified as a Certified Black-Owned Business
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                {isExpired ? 'Certificate Expired' : 'Invalid Certificate'}
              </h2>
              <p className="text-muted-foreground">
                {isExpired 
                  ? 'This certification has expired and is no longer valid.' 
                  : 'This certificate is no longer active.'}
              </p>
            </div>
          )}

          <div className="space-y-4 bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Business Name</p>
                <p className="font-semibold">{certificate.business_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Certificate Number</p>
                <p className="font-mono font-semibold">{certificate.certificate_number}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Valid Through</p>
                <p className={`font-semibold ${isExpired ? 'text-red-500' : ''}`}>
                  {certificate.expires_at 
                    ? new Date(certificate.expires_at).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link to={`/business/${certificate.business_id}`}>
                View Business Profile
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">
                Return to Mansa Musa Marketplace
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Verified by Mansa Musa Marketplace • Supporting Black-Owned Businesses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyCertificatePage;
