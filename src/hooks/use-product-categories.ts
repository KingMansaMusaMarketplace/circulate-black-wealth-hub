
import { useState } from 'react';
import { toast } from 'sonner';

export type ProductCategory = {
  id: string;
  name: string;
  color?: string;
};

const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: 'products', name: 'Products', color: '#3b82f6' },
  { id: 'services', name: 'Services', color: '#10b981' },
  { id: 'promotions', name: 'Promotions', color: '#f59e0b' },
];

export const useProductCategories = (businessId: string) => {
  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = (newCategory: Omit<ProductCategory, 'id'>) => {
    const id = crypto.randomUUID();
    setCategories(prev => [...prev, { ...newCategory, id }]);
    toast.success(`Added category: ${newCategory.name}`);
    return id;
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    toast.success('Category removed');
  };

  const updateCategory = (id: string, updates: Partial<Omit<ProductCategory, 'id'>>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id ? { ...category, ...updates } : category
      )
    );
    toast.success('Category updated');
  };

  return {
    categories,
    isLoading,
    addCategory,
    removeCategory,
    updateCategory
  };
};
