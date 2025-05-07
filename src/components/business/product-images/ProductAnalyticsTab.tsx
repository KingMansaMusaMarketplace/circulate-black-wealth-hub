
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from '@/lib/api/product-api';
import ProductAnalytics from './analytics/ProductAnalytics';

interface ProductAnalyticsTabProps {
  products: ProductImage[];
  loading: boolean;
}

const ProductAnalyticsTab: React.FC<ProductAnalyticsTabProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-80 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <ProductAnalytics products={products} />
      </CardContent>
    </Card>
  );
};

export default ProductAnalyticsTab;
