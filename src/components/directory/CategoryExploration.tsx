
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UtensilsCrossed, 
  Scissors, 
  Dumbbell, 
  Briefcase, 
  ShoppingBag, 
  Palette,
  GraduationCap,
  Laptop,
  Car,
  Banknote
} from 'lucide-react';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <UtensilsCrossed className="h-6 w-6" />;
      case 'Beauty & Wellness':
        return <Scissors className="h-6 w-6" />;
      case 'Health & Fitness':
        return <Dumbbell className="h-6 w-6" />;
      case 'Professional Services':
        return <Briefcase className="h-6 w-6" />;
      case 'Retail & Shopping':
        return <ShoppingBag className="h-6 w-6" />;
      case 'Art & Entertainment':
        return <Palette className="h-6 w-6" />;
      case 'Education':
        return <GraduationCap className="h-6 w-6" />;
      case 'Technology':
        return <Laptop className="h-6 w-6" />;
      case 'Transportation':
        return <Car className="h-6 w-6" />;
      case 'Finance':
        return <Banknote className="h-6 w-6" />;
      default:
        return <ShoppingBag className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'from-red-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-green-500 to-emerald-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-violet-500',
      'from-yellow-500 to-amber-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-purple-500'
    ];
    
    const index = categories.indexOf(category);
    return colors[index % colors.length] || 'from-gray-500 to-gray-600';
  };

  // Get business count for each category
  const getCategoryBusinessCount = (category: string) => {
    // This would typically come from your data aggregation
    // For now, we'll use placeholder counts
    const counts: { [key: string]: number } = {
      'Food & Dining': 24,
      'Beauty & Wellness': 18,
      'Health & Fitness': 12,
      'Professional Services': 15,
      'Retail & Shopping': 21,
      'Art & Entertainment': 9,
      'Education': 7,
      'Technology': 11,
      'Transportation': 5,
      'Finance': 8
    };
    
    return counts[category] || Math.floor(Math.random() * 20) + 1;
  };

  const displayCategories = categories.length > 0 ? categories : [
    'Food & Dining',
    'Beauty & Wellness', 
    'Health & Fitness',
    'Professional Services',
    'Retail & Shopping',
    'Art & Entertainment',
    'Education',
    'Technology',
    'Transportation',
    'Finance'
  ];

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-mansablue mb-2">Explore by Category</h2>
        <p className="text-gray-600">Discover Black-owned businesses by what you're looking for</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCategories.map((category) => (
          <Card 
            key={category}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedCategory === category ? 'ring-2 ring-mansablue shadow-lg' : ''
            }`}
            onClick={() => onCategorySelect(category)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center text-white shadow-lg`}>
                {getCategoryIcon(category)}
              </div>
              
              <h3 className="font-semibold text-sm mb-1 text-gray-900">
                {category}
              </h3>
              
              <Badge variant="secondary" className="text-xs">
                {getCategoryBusinessCount(category)} businesses
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-4 p-4 bg-mansablue/5 rounded-lg border border-mansablue/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getCategoryColor(selectedCategory)} flex items-center justify-center text-white`}>
                {getCategoryIcon(selectedCategory)}
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
