import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import FeatureGate from '@/components/auth/FeatureGate';
import KaylaRecordsManagement from '@/components/admin/ai/KaylaRecordsManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const BusinessRecordsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Records Management — Kayla AI Document Vault | 1325.AI</title>
        <meta
          name="description"
          content="Upload, OCR, and track business documents with expiration alerts. Included in Kayla AI Starter and above."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-7 w-7 text-mansagold" />
              <h1 className="text-3xl font-bold">Records Management</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered document vault. Upload licenses, permits, contracts, and insurance — Kayla
              extracts the details, tracks expirations, and answers questions.
            </p>
          </div>

          {!user ? (
            <Card>
              <CardHeader>
                <CardTitle>Please sign in</CardTitle>
              </CardHeader>
              <CardContent>
                You need to be signed in to access Records Management.
              </CardContent>
            </Card>
          ) : (
            <FeatureGate
              feature="canAccessRecordsManagement"
              requiredTier="kayla_starter"
            >
              <KaylaRecordsManagement />
            </FeatureGate>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessRecordsPage;
