
import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

interface PriceRange {
  min: number;
  max: number;
}

interface AdvancedSearchFiltersProps {
  categories: string[];
  onFilterChange: (filterType: string, value: any) => void;
  filterOptions: any;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  categories,
  onFilterChange,
  filterOptions,
  onApplyFilters,
  onResetFilters
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: filterOptions.priceRange?.min || 0,
    max: filterOptions.priceRange?.max || 100
  });
  
  const handlePriceRangeChange = (value: number[]) => {
    const newPriceRange = {
      min: value[0],
      max: value[1]
    };
    setPriceRange(newPriceRange);
    onFilterChange('priceRange', newPriceRange);
  };
  
  const features = [
    'Black-owned',
    'Verified business',
    'Online ordering',
    'Delivery available',
    'Appointment booking',
    'Accepts credit cards',
    'Wheelchair accessible',
    'Free WiFi',
    'Pet friendly'
  ];
  
  const paymentMethods = [
    'Credit Card',
    'Cash',
    'Mobile Payment',
    'Cryptocurrency',
    'Bank Transfer'
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center">
          <Search className="mr-2 h-5 w-5 text-mansablue" />
          Advanced Filters
        </h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset
          </Button>
          <Button 
            className="bg-mansablue hover:bg-mansablue-dark text-white"
            size="sm" 
            onClick={onApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
      
      <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
        <div>
          <Accordion type="single" collapsible defaultValue="categories">
            <AccordionItem value="categories">
              <AccordionTrigger className="py-2 text-base font-medium">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={filterOptions.categories?.includes(category)}
                        onCheckedChange={(checked) => {
                          const currentCategories = [...(filterOptions.categories || [])];
                          if (checked) {
                            onFilterChange('categories', [...currentCategories, category]);
                          } else {
                            onFilterChange(
                              'categories',
                              currentCategories.filter(cat => cat !== category)
                            );
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div>
          <Accordion type="single" collapsible defaultValue="features">
            <AccordionItem value="features">
              <AccordionTrigger className="py-2 text-base font-medium">Business Features</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`feature-${feature}`}
                        checked={filterOptions.features?.includes(feature)} 
                        onCheckedChange={(checked) => {
                          const currentFeatures = [...(filterOptions.features || [])];
                          if (checked) {
                            onFilterChange('features', [...currentFeatures, feature]);
                          } else {
                            onFilterChange(
                              'features',
                              currentFeatures.filter(f => f !== feature)
                            );
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`feature-${feature}`}
                        className="text-sm cursor-pointer"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div>
          <Accordion type="single" collapsible defaultValue="price">
            <AccordionItem value="price">
              <AccordionTrigger className="py-2 text-base font-medium">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="px-2 py-4">
                  <div className="mb-6">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[priceRange.min, priceRange.max]}
                      onValueChange={handlePriceRangeChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Min Price</p>
                      <p className="text-sm font-bold">${priceRange.min}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-right">Max Price</p>
                      <p className="text-sm font-bold">${priceRange.max}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div>
          <Accordion type="single" collapsible>
            <AccordionItem value="payment">
              <AccordionTrigger className="py-2 text-base font-medium">Payment Methods</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`payment-${method}`}
                        checked={filterOptions.paymentMethods?.includes(method)}
                        onCheckedChange={(checked) => {
                          const currentMethods = [...(filterOptions.paymentMethods || [])];
                          if (checked) {
                            onFilterChange('paymentMethods', [...currentMethods, method]);
                          } else {
                            onFilterChange(
                              'paymentMethods',
                              currentMethods.filter(m => m !== method)
                            );
                          }
                        }}
                      />
                      <Label 
                        htmlFor={`payment-${method}`}
                        className="text-sm cursor-pointer"
                      >
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchFilters;
