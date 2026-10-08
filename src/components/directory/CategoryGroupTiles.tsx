import React from 'react';
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
  /** Phones: show one swipeable row instead of the full grid */
  mobileRow?: boolean;
}

const CategoryGroupTiles: React.FC<CategoryGroupTilesProps> = ({
  groupCounts,
  selectedGroup,
  onSelectGroup,
  subCategories = [],
  selectedCategory,
  onSelectCategory,
  compact = false,
  mobileRow = false,
}) => {
  const [showAll, setShowAll] = React.useState(false);
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

  const hasCounts = Object.keys(groupCounts).length > 0;
  const groups = CATEGORY_GROUPS
    .map(g => ({ ...g, count: groupCounts[g.name] || 0 }))
    // While counts are still loading, keep every tile on screen so the
    // section never collapses and re-appears (flicker).
    .filter(g => (hasCounts ? g.count > 0 : true))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!mobileRow && !showAll) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowAll(true)}
          className="rounded-xl border border-mansagold/60 bg-slate-900/50 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900/80"
        >
          Browse by category <span className="text-mansagold">({groups.length}) ▾</span>
        </button>
      </div>
    );
  }

  if (mobileRow && !showAll) {
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold text-base">Browse by category</h2>
          <button onClick={() => setShowAll(true)} className="text-sm font-medium text-mansagold">
            See all ({groups.length})
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {groups.map(group => (
            <button
              key={group.name}
              onClick={() => onSelectGroup(group.name)}
              className="shrink-0 snap-start rounded-full border border-white/15 bg-slate-900/50 px-3 py-2 text-sm text-gray-100"
            >
              <span aria-hidden className="mr-1">{group.icon}</span>
              {group.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'mb-6' : 'mb-10'}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-base sm:text-lg">Browse by category</h2>
        {(
          <button onClick={() => setShowAll(false)} className="text-sm font-medium text-mansagold">
            {mobileRow ? 'Show less' : 'Hide categories'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {groups.map((group) => (
          <button
            key={group.name}
            onClick={() => onSelectGroup(group.name)}
            className="text-left rounded-xl border border-white/10 bg-slate-900/50 hover:border-mansagold/60 hover:bg-slate-900/80 transition-colors p-3 min-h-[76px] flex flex-col justify-between"
          >
            <span className="text-xl leading-none" aria-hidden>{group.icon}</span>
            <span className="mt-2 block">
              <span className="block text-white text-[13px] sm:text-sm font-medium leading-snug">
                {group.name}
              </span>
              <span className="block text-mansagold text-xs font-mono mt-0.5 min-h-[1rem]">
                {group.count > 0 ? group.count.toLocaleString() : ''}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGroupTiles;
