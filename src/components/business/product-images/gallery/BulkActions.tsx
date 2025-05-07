
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedIds: string[];
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkToggleActive: (ids: string[], setActive: boolean) => Promise<void>;
  onClearSelection: () => void;
  isProcessing: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onBulkDelete,
  onBulkToggleActive,
  onClearSelection,
  isProcessing
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (selectedIds.length === 0) return null;
  
  const handleBulkDelete = async () => {
    await onBulkDelete(selectedIds);
    setIsDeleteDialogOpen(false);
  };
  
  const handleBulkActivate = async () => {
    await onBulkToggleActive(selectedIds, true);
    toast.success(`${selectedIds.length} products activated`);
  };
  
  const handleBulkDeactivate = async () => {
    await onBulkToggleActive(selectedIds, false);
    toast.success(`${selectedIds.length} products deactivated`);
  };
  
  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-4 shadow-sm border animate-fade-in">
      <div className="text-sm font-medium">
        {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
      </div>
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkActivate}
          disabled={isProcessing}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Activate
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleBulkDeactivate}
          disabled={isProcessing}
          className="text-amber-600 border-amber-200 hover:bg-amber-50"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <X className="h-4 w-4 mr-1" />
          )}
          Deactivate
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="animate-scale-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Multiple Products</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting</>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
