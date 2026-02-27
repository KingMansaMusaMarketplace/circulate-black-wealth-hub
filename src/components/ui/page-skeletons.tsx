import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page skeleton for dashboard pages — replaces generic spinners
 */
export const DashboardPageSkeleton: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    {/* Stats row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>

    {/* Content area */}
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    {/* Table-like area */}
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-3">
      <div className="flex gap-4 pb-3 border-b border-white/10">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          {[...Array(4)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Profile page skeleton
 */
export const ProfilePageSkeleton: React.FC = () => (
  <div className="space-y-4 animate-in fade-in duration-300">
    {/* Avatar + name card */}
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-28 rounded-lg bg-white/10" />
      ))}
    </div>

    {/* Form card */}
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
      <Skeleton className="h-5 w-40 bg-white/10" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-lg bg-white/10" />
    </div>
  </div>
);

/**
 * Bookings/list page skeleton
 */
export const ListPageSkeleton: React.FC = () => (
  <div className="space-y-4 animate-in fade-in duration-300">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    ))}
  </div>
);
