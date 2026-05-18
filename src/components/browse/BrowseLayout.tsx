import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";

export type BrowseViewMode = "grid" | "list" | "map";

interface BrowseLayoutProps {
  /** Hero/header content (title, subtitle, top-right CTAs) */
  header: React.ReactNode;
  /** Search row (inputs + Search button). Sits inside the dark header band. */
  searchRow?: React.ReactNode;
  /** Filter button label / state */
  showFilters: boolean;
  onToggleFilters: () => void;
  /** Optional filter panel (rendered below the search row when open) */
  filterPanel?: React.ReactNode;
  /** Results count line / sort dropdown */
  resultsSummary?: React.ReactNode;
  sortControl?: React.ReactNode;
  /** View mode tabs */
  viewMode: BrowseViewMode;
  onViewModeChange: (mode: BrowseViewMode) => void;
  availableViews?: BrowseViewMode[]; // defaults to all three
  /** Main content area (grid / list / map) */
  children: React.ReactNode;
  /** Optional pagination row */
  pagination?: React.ReactNode;
  /** Optional footer (e.g. legal disclaimer) */
  footer?: React.ReactNode;
}

const BrowseLayout: React.FC<BrowseLayoutProps> = ({
  header,
  searchRow,
  showFilters,
  onToggleFilters,
  filterPanel,
  resultsSummary,
  sortControl,
  viewMode,
  onViewModeChange,
  availableViews = ["grid", "list", "map"],
  children,
  pagination,
  footer,
}) => {
  return (
    <div className="min-h-screen text-white bg-[radial-gradient(ellipse_at_top,_rgba(0,51,102,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.18),transparent_50%),linear-gradient(180deg,#05060f_0%,#020308_100%)]">
      {/* Header band */}
      <section className="border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {header}
          {searchRow && <div className="mt-6">{searchRow}</div>}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFilters}
              className="text-white/80 hover:text-white hover:bg-white/10 -ml-2"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              {showFilters ? "Hide filters" : "More filters"}
            </Button>
          </div>
          {showFilters && filterPanel && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              {filterPanel}
            </div>
          )}
        </div>
      </section>

      {/* Results header: count + sort + view tabs */}
      <section className="py-5 px-4 border-b border-white/5 sticky top-0 z-30 bg-black/85 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-h-[28px]">{resultsSummary}</div>
          <div className="flex items-center gap-2 flex-wrap">
            {sortControl}
            <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as BrowseViewMode)}>
              <TabsList className="bg-white/5 border border-white/15">
                {availableViews.includes("grid") && (
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-white/80"
                  >
                    <Grid className="w-4 h-4 mr-1" /> Grid
                  </TabsTrigger>
                )}
                {availableViews.includes("list") && (
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-white/80"
                  >
                    <List className="w-4 h-4 mr-1" /> List
                  </TabsTrigger>
                )}
                {availableViews.includes("map") && (
                  <TabsTrigger
                    value="map"
                    className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-white/80"
                  >
                    <MapIcon className="w-4 h-4 mr-1" /> Map
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {children}
          {pagination && <div className="mt-8">{pagination}</div>}
          {footer}
        </div>
      </section>
    </div>
  );
};

export default BrowseLayout;
