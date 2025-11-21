
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const successStories = [
  {
    name: "Maya Johnson",
    business: "Sweet Soul Bakery",
    location: "Atlanta, GA",
    testimonial: "Within 3 months of joining the Marketplace, my customer base grew by 45%. The circulation efforts have made my bakery a community cornerstone.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    impact: "3.2x revenue growth",
    category: "Food & Beverage",
    stars: 5
  },
  {
    name: "Jamal Washington",
    business: "Tech Roots Solutions",
    location: "Oakland, CA",
    testimonial: "The verification process gave my clients confidence in my business. I've connected with enterprise clients who specifically sought out verified Black-owned tech companies.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    impact: "5 enterprise partnerships",
    category: "Technology",
    stars: 5
  },
  {
    name: "Denise Carter",
    business: "Sankofa Wellness",
    location: "Chicago, IL",
    testimonial: "Before Mansa Musa Marketplace, I struggled with customer retention. Now my clients are part of a loyalty ecosystem that keeps them coming back.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    impact: "78% increased retention",
    category: "Health & Wellness",
    stars: 4
  }
];

const SuccessStoriesSection = () => {
  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/20 to-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent font-extrabold">Success Stories</h2>
          <div className="w-28 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full shadow-md"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-mansagold" />
            <p className="text-lg font-bold text-blue-100/90">Real Impact, Real Stories</p>
          </div>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-medium">
            Hear from business owners who are experiencing the power of intentional economic circulation through our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, index) => {
            const gradients = [
              'from-mansablue to-blue-700',
              'from-mansagold to-amber-600',
              'from-blue-600 to-blue-800'
            ];
            const borderColors = [
              'border-blue-400/30 hover:border-blue-400/60',
              'border-amber-400/30 hover:border-amber-400/60',
              'border-blue-400/30 hover:border-blue-400/60'
            ];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 ${borderColors[index]} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-xl`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <Avatar className="h-14 w-14 border-2 shadow-lg ring-2 ring-offset-2 ring-mansagold/40 ring-offset-slate-800">
                          <AvatarImage src={story.image} alt={story.name} />
                          <AvatarFallback className={`bg-gradient-to-br ${gradients[index]} text-white font-bold`}>
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-white">{story.name}</h3>
                          <p className="text-sm text-blue-200/70 font-medium">{story.location}</p>
                        </div>
                      </div>
                      <span className="inline-flex gap-0.5">
                        {Array(story.stars).fill(0).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className={`font-bold text-lg bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>{story.business}</h4>
                      <span className={`inline-block bg-gradient-to-r ${gradients[index]} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm mt-2`}>
                        {story.category}
                      </span>
                    </div>
                    
                    <blockquote className="italic text-blue-100/90 border-l-4 border-mansagold pl-4 py-2 font-medium leading-relaxed">
                      "{story.testimonial}"
                    </blockquote>
                    
                    <div className={`bg-gradient-to-br ${gradients[index]} p-4 rounded-xl shadow-md`}>
                      <div className="text-sm font-bold text-white/90">Impact Achieved</div>
                      <div className="font-extrabold text-xl text-white">{story.impact}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/directory" className="inline-flex items-center bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Explore Our Verified Businesses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
