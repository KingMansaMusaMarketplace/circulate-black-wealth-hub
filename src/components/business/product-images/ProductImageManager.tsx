
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, ImagePlus, BarChart } from "lucide-react";
import ProductImageForm from './ProductImageForm';
import ProductGallery from './ProductGallery';
import ProductAnalyticsTab from './ProductAnalyticsTab';
import { useProductImages } from '@/hooks/use-product-images';
import { ProductImageFormValues } from '../business-form/models';
import { ProductImage } from '@/lib/api/product-api';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

interface ProductImageManagerProps {
  businessId: string;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ businessId }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  
  const { 
    products,
    loading,
    uploading,
    batchUploading,
    batchProgress,
    loadProducts,
    addProduct,
    batchAddProducts,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    bulkDeleteProducts,
    bulkToggleActive
  } = useProductImages(businessId);

  useEffect(() => {
    if (businessId) {
      loadProducts();
    }
  }, [businessId]);

  const handleAddProduct = async (values: ProductImageFormValues, file: File) => {
    if (selectedProduct) {
      // If editing an existing product
      await updateProduct({
        id: selectedProduct.id,
        title: values.title,
        description: values.description,
        price: values.price,
        is_active: values.isActive,
        alt_text: values.altText,
        meta_description: values.metaDescription,
        category: values.category,
        tags: values.tags
      });
      setActiveTab('gallery');
      setSelectedProduct(null);
      return;
    }
    
    const result = await addProduct(file, values);
    if (result) {
      setActiveTab('gallery');
      setSelectedProduct(null);
    }
  };

  const handleBatchAddProducts = async (files: File[], defaultValues: Partial<ProductImageFormValues>) => {
    await batchAddProducts(files, defaultValues);
    setActiveTab('gallery');
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
  };
  
  const handleBulkDelete = async (ids: string[]) => {
    setBulkProcessing(true);
    try {
      await bulkDeleteProducts(ids);
    } catch (error) {
      toast.error("Failed to delete products");
    } finally {
      setBulkProcessing(false);
    }
  };
  
  const handleBulkToggleActive = async (ids: string[], isActive: boolean) => {
    setBulkProcessing(true);
    try {
      await bulkToggleActive(ids, isActive);
    } catch (error) {
      toast.error("Failed to update products");
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Products & Services</h2>
      
      {batchUploading && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between">
            <span>Uploading {batchProgress}%</span>
            <span>{batchProgress}%</span>
          </div>
          <Progress value={batchProgress} className="h-2" />
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <ImagePlus size={16} />
            {selectedProduct ? 'Edit Product' : 'Add New'}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart size={16} />
            Analytics
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
                onBulkDelete={handleBulkDelete}
                onBulkToggleActive={handleBulkToggleActive}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add" className="mt-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <ProductImageForm 
                onSubmit={handleAddProduct}
                onBatchSubmit={handleBatchAddProducts}
                isUploading={uploading}
                isBatchUploading={batchUploading}
                initialData={selectedProduct}
                businessId={businessId}
                onCancel={() => {
                  setSelectedProduct(null);
                  setActiveTab('gallery');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 animate-fade-in">
          <ProductAnalyticsTab 
            products={products}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductImageManager;
