
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProductImageManager } from '../product-images';
import { BusinessProfile } from '@/hooks/use-business-profile';

interface BusinessProductsContentProps {
  profile: BusinessProfile | null;
}

const BusinessProductsContent: React.FC<BusinessProductsContentProps> = ({ profile }) => {
  return (
    <>
      {profile?.id ? (
        <ProductImageManager businessId={profile.id} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <p>Please save your business details first before adding products.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BusinessProductsContent;
