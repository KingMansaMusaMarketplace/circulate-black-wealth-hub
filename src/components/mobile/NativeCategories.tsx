import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Utensils, 
  Scissors, 
  Home, 
  Briefcase, 
  Heart,
  Car,
  GraduationCap
} from 'lucide-react';

const categories = [
  { icon: ShoppingBag, name: 'Retail', color: 'bg-blue-500/10 text-blue-600' },
  { icon: Utensils, name: 'Food', color: 'bg-orange-500/10 text-orange-600' },
  { icon: Scissors, name: 'Beauty', color: 'bg-pink-500/10 text-pink-600' },
  { icon: Home, name: 'Home', color: 'bg-green-500/10 text-green-600' },
  { icon: Briefcase, name: 'Professional', color: 'bg-purple-500/10 text-purple-600' },
  { icon: Heart, name: 'Health', color: 'bg-red-500/10 text-red-600' },
  { icon: Car, name: 'Auto', color: 'bg-gray-500/10 text-gray-600' },
  { icon: GraduationCap, name: 'Education', color: 'bg-indigo-500/10 text-indigo-600' },
];

const NativeCategories = () => {
  return (
    <div className="px-4 py-6 bg-muted/30">
      <h2 className="text-xl font-bold mb-4">Browse Categories</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              to={`/directory?category=${category.name.toLowerCase()}`}
            >
              <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {category.name}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NativeCategories;
