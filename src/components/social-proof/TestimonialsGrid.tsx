import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/hooks/use-social-proof';

interface TestimonialsGridProps {
  testimonials: Testimonial[];
}

const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({ testimonials }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">What Our Community Says</h2>
        <p className="text-white/70 mt-2">Real feedback from real people</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full relative bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-blue-400/20 absolute top-4 right-4" />
                
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-white/90 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.profiles?.avatar_url} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {testimonial.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {testimonial.profiles?.full_name || 'Community Member'}
                    </p>
                    {testimonial.businesses?.business_name && (
                      <p className="text-xs text-white/60">
                        @ {testimonial.businesses.business_name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
