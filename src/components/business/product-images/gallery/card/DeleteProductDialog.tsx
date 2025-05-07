
import React from 'react';
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
import { Loader2 } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';

interface DeleteProductDialogProps {
  product: ProductImage;
  deletingId: string | null;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  product,
  deletingId,
  onDelete,
  isOpen,
  setIsOpen,
  children
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(product.id, product.image_url)}
            disabled={deletingId === product.id}
            className="transition-transform hover:scale-105"
          >
            {deletingId === product.id ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting</>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
