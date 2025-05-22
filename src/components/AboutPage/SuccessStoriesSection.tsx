
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
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Success Stories</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Real Impact, Real Stories</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from business owners who are experiencing the power of intentional economic circulation through our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <Avatar className="h-12 w-12 border-2 border-mansagold">
                        <AvatarImage src={story.image} alt={story.name} />
                        <AvatarFallback className="bg-mansablue text-white">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{story.name}</h3>
                        <p className="text-sm text-gray-500">{story.location}</p>
                      </div>
                    </div>
                    <span className="inline-flex gap-0.5">
                      {Array(story.stars).fill(0).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-mansagold text-mansagold" />
                      ))}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg text-mansablue-dark">{story.business}</h4>
                    <span className="inline-block bg-mansablue/10 text-mansablue text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {story.category}
                    </span>
                  </div>
                  
                  <blockquote className="italic text-gray-600 border-l-4 border-mansagold pl-4 py-2">
                    "{story.testimonial}"
                  </blockquote>
                  
                  <div className="bg-mansablue/5 p-3 rounded-lg">
                    <div className="text-sm font-medium text-mansablue">Impact Achieved</div>
                    <div className="font-bold text-lg">{story.impact}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/directory" className="text-mansablue font-bold flex items-center justify-center hover:underline">
            Explore Our Verified Businesses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
