import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Scale, Loader2 } from 'lucide-react';
import { useBusinessComparison } from '@/hooks/use-business-comparison';
import { BusinessComparison } from './BusinessComparison';

interface CompareButtonProps {
  businesses: any[];
}

export const CompareButton: React.FC<CompareButtonProps> = ({ businesses }) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { isComparing, comparisonResult, compareBusinesses, clearComparison } = useBusinessComparison();

  const handleToggleBusiness = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleCompare = async () => {
    const result = await compareBusinesses(selectedIds);
    if (result) {
      // Comparison will be shown via comparisonResult
    }
  };

  const handleClose = () => {
    setOpen(false);
    clearComparison();
    setSelectedIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-white/20 bg-slate-800/60 backdrop-blur-xl text-white hover:bg-slate-700/70 hover:text-mansagold">
          <Scale className="h-4 w-4" />
          Compare Businesses
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {comparisonResult ? 'AI Business Comparison' : 'Select Businesses to Compare'}
          </DialogTitle>
        </DialogHeader>

        {!comparisonResult ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select 2-4 businesses to generate an AI-powered comparison
              {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedIds.includes(business.id)}
                    onCheckedChange={() => handleToggleBusiness(business.id)}
                    disabled={!selectedIds.includes(business.id) && selectedIds.length >= 4}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{business.business_name || business.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {business.category} • {business.city}, {business.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCompare}
              disabled={selectedIds.length < 2 || isComparing}
              className="w-full"
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Comparison...
                </>
              ) : (
                <>
                  <Scale className="h-4 w-4 mr-2" />
                  Compare {selectedIds.length} Businesses
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <BusinessComparison 
              businesses={comparisonResult.businesses}
              comparison={comparisonResult.comparison}
            />
            <Button onClick={handleClose} className="w-full mt-6">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
