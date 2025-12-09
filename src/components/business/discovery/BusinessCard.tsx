import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Globe, Verified, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FoundingSponsorBadge } from '@/components/badges/FoundingSponsorBadge';

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
  is_founding_sponsor?: boolean;
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
    is_founding_sponsor,
    average_rating,
    review_count
  } = business;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-amber-400 fill-current' 
            : 'text-slate-600'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <Card className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mansablue/5 to-mansagold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Business Logo/Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20 rounded-lg ring-2 ring-white/10 group-hover:ring-mansablue/50 transition-all duration-300">
                <AvatarImage src={logo_url || banner_url} alt={business_name} />
                <AvatarFallback className="rounded-lg text-lg font-semibold bg-gradient-to-br from-mansablue to-blue-700 text-white">
                  {business_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link 
                      to={`/business/${id}`} 
                      className="font-semibold text-lg text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-amber-400 hover:bg-clip-text transition-all duration-300"
                    >
                      {business_name}
                    </Link>
                    {is_verified && (
                      <Verified className="h-5 w-5 text-blue-400" />
                    )}
                    {is_founding_sponsor && (
                      <FoundingSponsorBadge size="sm" showTooltip={false} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    {average_rating > 0 ? (
                      <div className="flex items-center gap-1">
                        {renderStars(average_rating)}
                        <span className="text-sm text-slate-400 ml-1">
                          {average_rating.toFixed(1)} ({review_count} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">No reviews yet</span>
                    )}
                    
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-200 border-white/10">{category}</Badge>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {(city || state) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">{city}{city && state ? ', ' : ''}{state}</span>
                      </div>
                    )}
                    
                    {phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-amber-400" />
                        <span className="text-slate-300">{phone}</span>
                      </div>
                    )}
                    
                    {website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <a 
                          href={website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-mansagold transition-colors text-slate-300"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-slate-700/50 text-slate-300 hover:text-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-slate-700/50 text-slate-300 hover:text-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Link to={`/business/${id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue hover:to-blue-700 text-white border-0">View Details</Button>
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
    <Card className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 to-mansagold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative overflow-hidden">
        {/* Banner Image */}
        {banner_url ? (
          <img 
            src={banner_url} 
            alt={business_name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-mansablue/30 to-blue-700/30" />
        )}
        
        {/* Overlay with logo */}
        <div className="absolute top-4 left-4">
          <Avatar className="w-16 h-16 border-4 border-slate-900/80 ring-2 ring-white/10 group-hover:ring-mansablue/50 transition-all duration-300">
            <AvatarImage src={logo_url} alt={business_name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-mansablue to-blue-700 text-white">
              {business_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Verification & Founding Sponsor Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {is_verified && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-0">
              <Verified className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {is_founding_sponsor && (
            <FoundingSponsorBadge size="sm" showTooltip={false} />
          )}
        </div>
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link 
              to={`/business/${id}`} 
              className="font-semibold text-lg text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-amber-400 hover:bg-clip-text transition-all duration-300 line-clamp-1"
            >
              {business_name}
            </Link>
            <Badge variant="secondary" className="mt-1 bg-slate-700/50 text-slate-200 border-white/10">{category}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-10">
        {/* Rating */}
        {average_rating > 0 ? (
          <div className="flex items-center gap-1 mb-3">
            {renderStars(average_rating)}
            <span className="text-sm text-slate-400 ml-1">
              {average_rating.toFixed(1)} ({review_count})
            </span>
          </div>
        ) : (
          <div className="mb-3 text-sm text-slate-500">No reviews yet</div>
        )}

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Location */}
        {(city || state) && (
          <div className="flex items-center gap-1 text-sm text-slate-400 mb-4">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300">{city}{city && state ? ', ' : ''}{state}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-slate-700/50 text-slate-300 hover:text-white">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-slate-700/50 text-slate-300 hover:text-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Link to={`/business/${id}`}>
            <Button size="sm" className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue hover:to-blue-700 text-white border-0 shadow-lg shadow-mansablue/30">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};