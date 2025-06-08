
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useUserFavorites } from '@/hooks/use-user-favorites';

interface FavoriteButtonProps {
  businessId: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  businessId,
  size = 'sm',
  variant = 'ghost'
}) => {
  const { isFavorite, toggleFavorite, loading } = useUserFavorites();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(businessId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={`${isFavorite(businessId) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorite(businessId) ? 'fill-current' : ''}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
