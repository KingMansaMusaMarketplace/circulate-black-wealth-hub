import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Star, DollarSign, CheckCircle } from 'lucide-react';
import { BusinessCapability } from '@/hooks/use-b2b';

interface SupplierCardProps {
  capability: BusinessCapability;
  onConnect: () => void;
}

export function SupplierCard({ capability, onConnect }: SupplierCardProps) {
  const formatPrice = () => {
    if (capability.price_range_min && capability.price_range_max) {
      return `$${capability.price_range_min.toLocaleString()} - $${capability.price_range_max.toLocaleString()}`;
    }
    if (capability.minimum_order_value) {
      return `Min: $${capability.minimum_order_value.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="pt-4 flex-1">
        {/* Business Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={capability.business?.logo_url || undefined} 
              alt={capability.business?.business_name} 
            />
            <AvatarFallback>
              {capability.business?.business_name?.charAt(0) || 'B'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">
              {capability.business?.business_name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {capability.business?.city && capability.business?.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {capability.business.city}, {capability.business.state}
                </span>
              )}
              {capability.business?.average_rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {capability.business.average_rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Capability Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {capability.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {capability.capability_type}
            </Badge>
          </div>

          <h3 className="font-semibold">{capability.title}</h3>
          
          {capability.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {capability.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {capability.lead_time_days && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {capability.lead_time_days} days lead time
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatPrice()}
            </span>
          </div>

          {/* Certifications */}
          {capability.certifications && capability.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {capability.certifications.slice(0, 3).map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {cert}
                </Badge>
              ))}
              {capability.certifications.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{capability.certifications.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button onClick={onConnect} className="w-full" size="sm">
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
