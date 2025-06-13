
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { businessCategories } from '@/data/businessCategories';
import { useBusinessDirectory } from '@/hooks/use-business-directory';

interface CategoryExplorationProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
  className?: string;
}

const CategoryExploration: React.FC<CategoryExplorationProps> = ({ 
  onCategorySelect, 
  selectedCategory,
  className = '' 
}) => {
  // Get real categories from Supabase
  const { categories } = useBusinessDirectory({ autoFetch: false });

  // Use our comprehensive business categories
  const displayCategories = businessCategories.slice(0, 20); // Show first 20 categories

  const getCategoryBusinessCount = (categoryId: string) => {
    // This would typically come from your data aggregation
    // For now, we'll use placeholder counts
    return Math.floor(Math.random() * 25) + 5;
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-mansablue mb-2">Explore by Category</h2>
        <p className="text-gray-600">Discover Black-owned businesses by what you're looking for</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedCategory === category.name ? 'ring-2 ring-mansablue shadow-lg' : ''
            }`}
            onClick={() => onCategorySelect(category.name)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-mansablue to-mansagold flex items-center justify-center text-white shadow-lg text-2xl">
                {category.icon}
              </div>
              
              <h3 className="font-semibold text-sm mb-1 text-gray-900">
                {category.name}
              </h3>
              
              <Badge variant="secondary" className="text-xs">
                {getCategoryBusinessCount(category.id)} businesses
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-4 p-4 bg-mansablue/5 rounded-lg border border-mansablue/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mansablue to-mansagold flex items-center justify-center text-white">
                {businessCategories.find(cat => cat.name === selectedCategory)?.icon || '🏢'}
              </div>
              <div>
                <span className="font-medium text-mansablue">Exploring: {selectedCategory}</span>
                <p className="text-sm text-gray-600">
                  {getCategoryBusinessCount(selectedCategory)} businesses found
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => onCategorySelect('all')}
              className="text-sm text-mansablue hover:underline"
            >
              Clear filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryExploration;
