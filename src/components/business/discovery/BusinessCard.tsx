import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Globe, Verified, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Business {
  id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  banner_url: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
}

interface BusinessCardProps {
  business: Business;
  viewMode: 'grid' | 'list';
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode }) => {
  const {
    id,
    business_name,
    description,
    category,
    city,
    state,
    phone,
    website,
    logo_url,
    banner_url,
    is_verified,
    average_rating,
    review_count
  } = business;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Business Logo/Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20 rounded-lg">
                <AvatarImage src={logo_url || banner_url} alt={business_name} />
                <AvatarFallback className="rounded-lg text-lg font-semibold bg-primary text-primary-foreground">
                  {business_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      to={`/business/${id}`} 
                      className="font-semibold text-lg hover:text-primary transition-colors"
                    >
                      {business_name}
                    </Link>
                    {is_verified && (
                      <Verified className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    {average_rating > 0 ? (
                      <div className="flex items-center gap-1">
                        {renderStars(average_rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          {average_rating.toFixed(1)} ({review_count} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No reviews yet</span>
                    )}
                    
                    <Badge variant="secondary">{category}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {(city || state) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{city}{city && state ? ', ' : ''}{state}</span>
                      </div>
                    )}
                    
                    {phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{phone}</span>
                      </div>
                    )}
                    
                    {website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Link to={`/business/${id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="relative overflow-hidden">
        {/* Banner Image */}
        {banner_url ? (
          <img 
            src={banner_url} 
            alt={business_name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10" />
        )}
        
        {/* Overlay with logo */}
        <div className="absolute top-4 left-4">
          <Avatar className="w-16 h-16 border-4 border-background">
            <AvatarImage src={logo_url} alt={business_name} />
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {business_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Verification Badge */}
        {is_verified && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-blue-500 text-white">
              <Verified className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link 
              to={`/business/${id}`} 
              className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
            >
              {business_name}
            </Link>
            <Badge variant="secondary" className="mt-1">{category}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Rating */}
        {average_rating > 0 ? (
          <div className="flex items-center gap-1 mb-3">
            {renderStars(average_rating)}
            <span className="text-sm text-muted-foreground ml-1">
              {average_rating.toFixed(1)} ({review_count})
            </span>
          </div>
        ) : (
          <div className="mb-3 text-sm text-muted-foreground">No reviews yet</div>
        )}

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Location */}
        {(city || state) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{city}{city && state ? ', ' : ''}{state}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Link to={`/business/${id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};