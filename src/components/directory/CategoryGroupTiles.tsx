import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_GROUPS, getGroupIcon } from '@/data/categoryGroups';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface CategoryGroupTilesProps {
  groupCounts: Record<string, number>;
  selectedGroup?: string;
  onSelectGroup: (group?: string) => void;
  /** Specific business types inside the selected group, with counts */
  subCategories?: { name: string; count: number }[];
  selectedCategory?: string;
  onSelectCategory?: (category?: string) => void;
  compact?: boolean;
}

const CategoryGroupTiles: React.FC<CategoryGroupTilesProps> = ({
  groupCounts,
  selectedGroup,
  onSelectGroup,
  subCategories = [],
  selectedCategory,
  onSelectCategory,
  compact = false,
}) => {
  if (selectedGroup) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectGroup(undefined)}
            className="text-gray-300 hover:text-mansagold px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            All categories
          </Button>
          <span className="text-xl" aria-hidden>{getGroupIcon(selectedGroup)}</span>
          <h2 className="text-white font-semibold text-lg">{selectedGroup}</h2>
          {groupCounts[selectedGroup] != null && (
            <span className="text-mansagold text-sm font-mono">
              {groupCounts[selectedGroup].toLocaleString()}
            </span>
          )}
        </div>

        {subCategories.length > 0 && onSelectCategory && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            <button
              onClick={() => onSelectCategory(undefined)}
              className={`shrink-0 snap-start rounded-full border px-3 py-1.5 text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-mansagold text-black border-mansagold font-semibold'
                  : 'border-white/15 text-gray-200 hover:border-mansagold/60'
              }`}
            >
              All types
            </button>
            {subCategories.map(sub => (
              <button
                key={sub.name}
                onClick={() => onSelectCategory(sub.name)}
                className={`shrink-0 snap-start rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === sub.name
                    ? 'bg-mansagold text-black border-mansagold font-semibold'
                    : 'border-white/15 text-gray-200 hover:border-mansagold/60'
                }`}
              >
                {sub.name}
                <span className="ml-1.5 text-xs opacity-70">{sub.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const groups = CATEGORY_GROUPS
    .map(g => ({ ...g, count: groupCounts[g.name] || 0 }))
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className={compact ? 'mb-6' : 'mb-10'}>
      <h2 className="text-white font-semibold text-base sm:text-lg mb-3">Browse by category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {groups.map((group, i) => (
          <motion.button
            key={group.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.012, 0.3) }}
            onClick={() => onSelectGroup(group.name)}
            className="text-left rounded-xl border border-white/10 bg-slate-900/50 hover:border-mansagold/60 hover:bg-slate-900/80 transition-colors p-3 min-h-[76px] flex flex-col justify-between"
          >
            <span className="text-xl leading-none" aria-hidden>{group.icon}</span>
            <span className="mt-2 block">
              <span className="block text-white text-[13px] sm:text-sm font-medium leading-snug">
                {group.name}
              </span>
              <span className="block text-mansagold text-xs font-mono mt-0.5">
                {group.count.toLocaleString()}
              </span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGroupTiles;
