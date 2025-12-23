import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star, TrendingUp, Users, Award } from 'lucide-react';

interface SuccessStory {
  id: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  image: string;
  testimonial: string;
  stats: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  featured?: boolean;
}

// Real success stories will be loaded from the database once available
const successStories: SuccessStory[] = [];

export const SuccessStories: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-base px-4 py-2">
            <Award className="mr-2 h-4 w-4" />
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Businesses, Real Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Black-owned businesses are thriving with Mansa Musa Marketplace
          </p>
        </div>

        {successStories.length === 0 ? (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Success Stories Coming Soon</h3>
            <p className="text-muted-foreground">
              We are onboarding our first businesses. Check back soon to see real success stories from our growing community.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {successStories.map((story) => (
                <Card 
                  key={story.id} 
                  className={`overflow-hidden transition-all hover:shadow-xl ${
                    story.featured ? 'border-primary shadow-lg' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    {story.featured && (
                      <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500">
                        Featured Success
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="text-2xl font-bold text-primary">
                          {story.ownerName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{story.businessName}</h3>
                        <p className="text-sm text-muted-foreground">{story.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{story.businessType}</p>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                      <p className="text-sm leading-relaxed pl-6 italic">
                        &quot;{story.testimonial}&quot;
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      {story.stats.map((stat, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {stat.icon}
                            <span>{stat.label}</span>
                          </div>
                          <div className="font-bold text-primary">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Join hundreds of businesses already growing with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Badge variant="outline" className="text-base px-6 py-2">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Average 200%+ Revenue Growth
                </Badge>
                <Badge variant="outline" className="text-base px-6 py-2">
                  <Star className="mr-2 h-4 w-4" />
                  4.8+ Average Customer Rating
                </Badge>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
