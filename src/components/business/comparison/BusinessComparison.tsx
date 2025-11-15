import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, TrendingUp, DollarSign, Users } from 'lucide-react';

interface ComparisonProps {
  businesses: any[];
  comparison: {
    summary: string;
    comparison: {
      services: string;
      pricing: string;
      experience: string;
      location: string;
    };
    bestFor: Array<{
      businessName: string;
      useCase: string;
      reason: string;
    }>;
    valueAnalysis: string;
    recommendation: string;
  };
}

export const BusinessComparison: React.FC<ComparisonProps> = ({ businesses, comparison }) => {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed">{comparison.summary}</p>
        </CardContent>
      </Card>

      {/* Businesses Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((business) => (
          <Card key={business.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">{business.business_name || business.name}</h3>
              <div className="space-y-2 text-sm">
                <Badge variant="secondary">{business.category}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{business.city}, {business.state}</span>
                </div>
                {business.average_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{business.average_rating} ({business.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Services & Offerings
            </h4>
            <p className="text-sm text-muted-foreground">{comparison.comparison.services}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Pricing & Value
            </h4>
            <p className="text-sm text-muted-foreground">{comparison.comparison.pricing}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Customer Experience
            </h4>
            <p className="text-sm text-muted-foreground">{comparison.comparison.experience}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location & Accessibility
            </h4>
            <p className="text-sm text-muted-foreground">{comparison.comparison.location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Best Suited For */}
      <Card>
        <CardHeader>
          <CardTitle>Best Suited For</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comparison.bestFor.map((item, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">{item.businessName}</h4>
              <p className="text-xs text-primary font-medium mb-1">{item.useCase}</p>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Value Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Value Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{comparison.valueAnalysis}</p>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Our Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{comparison.recommendation}</p>
        </CardContent>
      </Card>
    </div>
  );
};
