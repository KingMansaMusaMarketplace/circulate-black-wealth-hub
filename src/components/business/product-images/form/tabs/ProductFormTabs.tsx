
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Search, Settings } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';

interface ProductFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  initialData: ProductImage | null | undefined;
  onBatchSubmit: boolean;
  children: React.ReactNode; 
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  activeTab,
  setActiveTab,
  initialData,
  onBatchSubmit,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="single" className="flex items-center gap-2">
          <ImageIcon size={16} />
          Single Upload
        </TabsTrigger>
        
        {onBatchSubmit && (
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Batch Upload
          </TabsTrigger>
        )}
        
        {initialData && (
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search size={16} />
            SEO
          </TabsTrigger>
        )}
        
        {initialData && (
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings size={16} />
            Advanced
          </TabsTrigger>
        )}
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default ProductFormTabs;
