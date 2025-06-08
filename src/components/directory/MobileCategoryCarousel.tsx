
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

interface MobileCategoryCarouselProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
}

const MobileCategoryCarousel: React.FC<MobileCategoryCarouselProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining': return <UtensilsCrossed className="h-4 w-4" />;
      case 'Beauty & Wellness': return <Scissors className="h-4 w-4" />;
      case 'Health & Fitness': return <Dumbbell className="h-4 w-4" />;
      case 'Professional Services': return <Briefcase className="h-4 w-4" />;
      case 'Retail & Shopping': return <ShoppingBag className="h-4 w-4" />;
      case 'Art & Entertainment': return <Palette className="h-4 w-4" />;
      case 'Education': return <GraduationCap className="h-4 w-4" />;
      case 'Technology': return <Laptop className="h-4 w-4" />;
      case 'Transportation': return <Car className="h-4 w-4" />;
      case 'Finance': return <Banknote className="h-4 w-4" />;
      default: return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const displayCategories = categories.length > 0 ? categories : [
    'Food & Dining',
    'Beauty & Wellness', 
    'Health & Fitness',
    'Professional Services',
    'Retail & Shopping',
    'Art & Entertainment'
  ];

  return (
    <div className="md:hidden bg-white border-b border-gray-100">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Browse Categories</h3>
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayCategories.map((category) => (
              <Card
                key={category}
                className={`flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category ? 'ring-2 ring-mansablue shadow-md' : ''
                }`}
                onClick={() => onCategorySelect(category)}
              >
                <CardContent className="p-3 text-center w-20">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="text-xs font-medium text-gray-900 leading-tight">
                    {category.split(' ')[0]}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {selectedCategory && (
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary" className="bg-mansablue/10 text-mansablue">
              {selectedCategory}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategorySelect('all')}
              className="text-xs text-mansablue"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategoryCarousel;
