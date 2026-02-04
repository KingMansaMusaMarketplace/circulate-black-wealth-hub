import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string | undefined;
  onSelectCategory: (category: string | undefined) => void;
  businessCounts?: Record<string, number>;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  businessCounts = {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Category icons mapping
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Restaurant': '🍽️',
      'Restaurants': '🍽️',
      'Food & Dining': '🍽️',
      'Beauty': '💄',
      'Beauty & Wellness': '💄',
      'Hair Salon': '💇',
      'Barber': '💈',
      'Retail': '🛍️',
      'Fashion': '👗',
      'Health': '🏥',
      'Healthcare': '🏥',
      'Fitness': '💪',
      'Technology': '💻',
      'Tech': '💻',
      'Professional Services': '💼',
      'Legal': '⚖️',
      'Financial': '💰',
      'Finance': '💰',
      'Real Estate': '🏠',
      'Education': '📚',
      'Entertainment': '🎭',
      'Arts': '🎨',
      'Automotive': '🚗',
      'Home Services': '🔧',
      'Construction': '🏗️',
      'Travel': '✈️',
      'Photography': '📷',
      'Media': '📺',
      'Music': '🎵',
      'Sports': '⚽',
      'Childcare': '👶',
      'Pet Services': '🐾',
      'Catering': '🍴',
      'Bakery': '🧁',
      'Coffee': '☕',
      'Grocery': '🥬',
    };
    return icons[category] || '✨';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative mb-8"
    >
      {/* Left scroll button */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-slate-900/90 border border-white/10 text-white hover:bg-slate-800 hover:text-mansagold shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Categories pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(undefined)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0",
            !selectedCategory
              ? "bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold shadow-lg shadow-mansagold/30"
              : "bg-slate-800/80 text-gray-300 border border-white/10 hover:border-mansagold/50 hover:text-white"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span>All</span>
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            !selectedCategory ? "bg-slate-900/30 text-slate-900" : "bg-white/10 text-gray-400"
          )}>
            {Object.values(businessCounts).reduce((a, b) => a + b, 0) || categories.length}
          </span>
        </motion.button>

        {/* Category pills */}
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0",
              selectedCategory === category
                ? "bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold shadow-lg shadow-mansagold/30"
                : "bg-slate-800/80 text-gray-300 border border-white/10 hover:border-mansagold/50 hover:text-white"
            )}
          >
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
            {businessCounts[category] && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                selectedCategory === category ? "bg-slate-900/30 text-slate-900" : "bg-white/10 text-gray-400"
              )}>
                {businessCounts[category]}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-slate-900/90 border border-white/10 text-white hover:bg-slate-800 hover:text-mansagold shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Gradient fades */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
};

export default CategoryPills;
