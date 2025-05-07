
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Pencil, 
  Trash2, 
  Loader2, 
  ImageIcon,
  ArrowUpDown,
  Filter,
  Search,
  Eye
} from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  products: ProductImage[];
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
}

// Sort and filter types
type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';
type FilterOption = 'all' | 'active' | 'inactive';

const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  loading,
  onDelete,
  onToggleActive,
  onEdit
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  
  const itemsPerPage = 6;
  
  // Apply filtering
  const filteredProducts = products.filter(product => {
    // Apply search term filter
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
                          
    // Apply status filter
    let matchesStatus = true;
    if (filterBy === 'active') matchesStatus = product.is_active;
    if (filterBy === 'inactive') matchesStatus = !product.is_active;
    
    return matchesSearch && matchesStatus;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Apply pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBy]);
  
  const handleDelete = async (id: string, imageUrl: string) => {
    setDeletingId(id);
    await onDelete(id, imageUrl);
    setDeletingId(null);
  };
  
  const handleToggleActive = async (id: string, currentState: boolean) => {
    setTogglingId(id);
    await onToggleActive(id, !currentState);
    setTogglingId(null);
  };
  
  const viewProductDetails = (product: ProductImage) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };
  
  const animateCard = (id: string) => {
    setAnimatingCardId(id);
    setTimeout(() => setAnimatingCardId(null), 1000);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No products yet</h3>
        <p className="text-gray-500 max-w-md">
          Start showcasing your products or services by adding images and descriptions.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-center animate-fade-in">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-1/2 md:w-auto">
            <Select 
              value={filterBy} 
              onValueChange={(value: FilterOption) => setFilterBy(value)}
              aria-label="Filter products"
            >
              <SelectTrigger className="w-36">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-1/2 md:w-auto">
            <Select 
              value={sortBy} 
              onValueChange={(value: SortOption) => setSortBy(value)}
              aria-label="Sort products"
            >
              <SelectTrigger className="w-36">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 animate-fade-in">
          <p className="text-gray-500">No products match your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {paginatedProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className={cn(
                  "transition-all duration-300 hover:shadow-md", 
                  product.is_active ? '' : 'opacity-70',
                  animatingCardId === product.id ? 'ring-2 ring-primary scale-[1.02]' : '',
                  "animate-fade-in"
                )}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
                tabIndex={0}
              >
                <div 
                  className="relative aspect-video overflow-hidden cursor-pointer"
                  onClick={() => viewProductDetails(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      viewProductDetails(product);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details of ${product.title}`}
                >
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  {!product.is_active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded">Inactive</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-1">{product.title}</h3>
                      {product.price && (
                        <p className="text-sm text-mansablue font-medium">{product.price}</p>
                      )}
                    </div>
                    <Switch 
                      checked={product.is_active} 
                      disabled={togglingId === product.id}
                      onCheckedChange={() => handleToggleActive(product.id, product.is_active)}
                      aria-label={product.is_active ? "Set product as inactive" : "Set product as active"}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {product.description}
                  </p>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 px-2 transition-colors hover:bg-gray-100"
                    onClick={() => viewProductDetails(product)}
                    aria-label="View product details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {onEdit && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 px-2 transition-colors hover:bg-gray-100"
                      onClick={() => {
                        animateCard(product.id);
                        onEdit(product);
                      }}
                      aria-label="Edit product"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="h-8 px-2 transition-opacity hover:opacity-90"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                          onClick={() => handleDelete(product.id, product.image_url)}
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
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={cn(
                      currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                      'transition-transform hover:scale-105 focus:scale-105'
                    )}
                    aria-disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  />
                </PaginationItem>
                
                {Array.from({length: Math.min(5, totalPages)}).map((_, i) => {
                  let pageNum: number;
                  
                  // Logic to display appropriate page numbers
                  if (totalPages <= 5) {
                    // Show all pages if 5 or fewer
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // Near the start
                    if (i < 4) pageNum = i + 1;
                    else pageNum = totalPages;
                  } else if (currentPage >= totalPages - 2) {
                    // Near the end
                    if (i === 0) pageNum = 1;
                    else pageNum = totalPages - (4 - i);
                  } else {
                    // In the middle
                    pageNum = currentPage - 2 + i;
                    if (i === 0) pageNum = 1;
                    if (i === 4) pageNum = totalPages;
                  }
                  
                  // Show ellipsis instead of certain page numbers
                  if ((totalPages > 5) && 
                      ((i === 1 && currentPage > 3) || 
                       (i === 3 && currentPage < totalPages - 2))) {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className={cn(
                          'transition-transform hover:scale-105 focus:scale-105',
                          currentPage === pageNum ? 'animate-pulse-gold' : ''
                        )}
                        aria-label={`Go to page ${pageNum}`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={cn(
                      currentPage === totalPages ? 'pointer-events-none opacity-50' : '',
                      'transition-transform hover:scale-105 focus:scale-105'
                    )}
                    aria-disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      
      {/* Product Details Dialog */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl animate-enter">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-md">
                <img 
                  src={selectedProduct.image_url} 
                  alt={selectedProduct.title}
                  className="object-contain w-full h-full transition-all duration-500 hover:scale-105"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium">{selectedProduct.title}</h3>
                    {selectedProduct.price && (
                      <p className="text-lg text-mansablue font-medium">{selectedProduct.price}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-300 ${
                      selectedProduct.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProduct.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                
                <div className="pt-4 border-t text-sm text-gray-500">
                  <p>Created: {new Date(selectedProduct.created_at || '').toLocaleDateString()}</p>
                  {selectedProduct.updated_at && (
                    <p>Last updated: {new Date(selectedProduct.updated_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
