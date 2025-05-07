
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, ImagePlus } from "lucide-react";
import ProductImageForm from './ProductImageForm';
import ProductGallery from './ProductGallery';
import { useProductImages } from '@/hooks/use-product-images';
import { ProductImageFormValues } from '../business-form/models';
import { ProductImage } from '@/lib/api/product-api';

interface ProductImageManagerProps {
  businessId: string;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ businessId }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  
  const { 
    products,
    loading,
    uploading,
    loadProducts,
    addProduct,
    deleteProduct,
    toggleProductActive 
  } = useProductImages(businessId);

  useEffect(() => {
    if (businessId) {
      loadProducts();
    }
  }, [businessId]);

  const handleAddProduct = async (values: ProductImageFormValues, file: File) => {
    const result = await addProduct(file, values);
    if (result) {
      setActiveTab('gallery');
    }
  };

  const handleDeleteProduct = async (id: string, imageUrl: string) => {
    await deleteProduct(id, imageUrl);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleProductActive(id, isActive);
  };
  
  const handleEditProduct = (product: ProductImage) => {
    setSelectedProduct(product);
    setActiveTab('add');
    // Logic for editing would go here
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Products & Services</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <ImagePlus size={16} />
            {selectedProduct ? 'Edit Product' : 'Add New'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ProductGallery 
                products={products} 
                loading={loading}
                onDelete={handleDeleteProduct}
                onToggleActive={handleToggleActive}
                onEdit={handleEditProduct}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <ProductImageForm 
                onSubmit={handleAddProduct}
                isUploading={uploading}
                initialData={selectedProduct}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductImageManager;
