import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DirectoryEmptyStateProps {
  onResetFilters?: () => void;
  className?: string;
  /** Compact variant for narrow panels (e.g. split view list) */
  compact?: boolean;
}

const DirectoryEmptyState: React.FC<DirectoryEmptyStateProps> = ({
  onResetFilters,
  className,
  compact = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'text-center border border-dashed border-white/20 rounded-2xl bg-slate-900/50 backdrop-blur-sm',
        compact ? 'py-10 px-4' : 'py-16 px-6',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10',
          compact ? 'w-14 h-14' : 'w-20 h-20 mb-6',
        )}
      >
        <span className={compact ? 'text-2xl' : 'text-4xl'}>🔍</span>
      </div>
      <h3
        className={cn(
          'font-bold text-white mb-2',
          compact ? 'text-lg' : 'text-2xl mb-3',
        )}
      >
        No businesses found
      </h3>
      <p
        className={cn(
          'text-gray-400 max-w-md mx-auto mb-5',
          compact ? 'text-sm' : 'text-lg mb-6',
        )}
      >
        Try adjusting your search or filters to discover more verified businesses in your area.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onResetFilters && (
          <Button
            onClick={onResetFilters}
            size={compact ? 'sm' : 'default'}
            className="bg-mansagold text-slate-900 hover:bg-amber-400 font-semibold"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
        <Link to="/business-signup">
          <Button
            variant="outline"
            size={compact ? 'sm' : 'default'}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a business
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default DirectoryEmptyState;
