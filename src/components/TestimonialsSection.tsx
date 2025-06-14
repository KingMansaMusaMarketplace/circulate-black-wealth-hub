
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, Award } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Implementing Mansa Musa's loyalty program increased our customer return rate by 40% in just two months. The QR code system is so easy for both our staff and customers.",
    author: "Sarah Johnson",
    role: "Owner, The Cozy Corner Cafe",
    avatar: "SJ",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "business",
    metrics: { increase: "40%", metric: "Return Rate" },
    location: "Atlanta, GA"
  },
  {
    id: 2,
    content: "As a customer, I love collecting points at my favorite shops. I've already redeemed rewards at three different businesses, and the experience was seamless.",
    author: "Marcus Chen",
    role: "Loyal Customer",
    avatar: "MC",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "customer",
    points: "2,450",
    saved: "$127"
  },
  {
    id: 3,
    content: "The analytics provided by Mansa Musa have completely transformed how we approach our marketing. We now know exactly what brings customers back.",
    author: "Priya Patel",
    role: "Marketing Director, Urban Fitness",
    avatar: "PP",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "business",
    metrics: { increase: "65%", metric: "Customer Insights" },
    location: "Houston, TX"
  },
  {
    id: 4,
    content: "Since joining Mansa Musa, my barbershop has seen a 30% increase in new customers. The community really supports each other here.",
    author: "DeAndre Williams",
    role: "Owner, Fresh Cuts Barbershop",
    avatar: "DW",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "business",
    metrics: { increase: "30%", metric: "New Customers" },
    location: "Chicago, IL"
  },
  {
    id: 5,
    content: "I've discovered so many amazing Black-owned businesses through this platform. The rewards are just a bonus - supporting my community is priceless.",
    author: "Jasmine Thompson",
    role: "Community Advocate",
    avatar: "JT",
    image: "https://images.unsplash.com/photo-1494790108755-2616c78d5c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "customer",
    points: "3,200",
    saved: "$180"
  },
  {
    id: 6,
    content: "Our restaurant's revenue increased by 25% after joining. The platform makes it easy for customers to find us and come back for more.",
    author: "Chef Antoine Davis",
    role: "Owner, Soul Kitchen",
    avatar: "AD",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    type: "business",
    metrics: { increase: "25%", metric: "Revenue Growth" },
    location: "New Orleans, LA"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See how businesses and customers are thriving together in our marketplace
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Avg. 35% Revenue Increase</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Users className="w-5 h-5 text-mansablue" />
                <span className="text-sm font-medium">12,500+ Happy Members</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Award className="w-5 h-5 text-mansagold" />
                <span className="text-sm font-medium">4.9/5 Satisfaction</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Header with Avatar and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} alt={testimonial.author} />
                        <AvatarFallback className="bg-mansablue text-white">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        {testimonial.location && (
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={testimonial.type === 'business' ? 'bg-mansagold/10 text-mansagold' : 'bg-mansablue/10 text-mansablue'}
                    >
                      {testimonial.type === 'business' ? 'Business' : 'Customer'}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Metrics */}
                  {testimonial.type === 'business' && testimonial.metrics && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">{testimonial.metrics.metric}</span>
                        <span className="text-lg font-bold text-green-800">
                          +{testimonial.metrics.increase}
                        </span>
                      </div>
                    </div>
                  )}

                  {testimonial.type === 'customer' && testimonial.points && (
                    <div className="bg-mansablue/5 rounded-lg p-3 border border-mansablue/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-mansablue">Points Earned</span>
                        <span className="font-bold text-mansablue">{testimonial.points}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-green-700">Money Saved</span>
                        <span className="font-bold text-green-800">{testimonial.saved}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to join thousands of satisfied members?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-mansablue text-white px-8 py-3 rounded-lg font-semibold hover:bg-mansablue-dark transition-colors">
              Start Your Journey
            </button>
            <button className="border border-mansablue text-mansablue px-8 py-3 rounded-lg font-semibold hover:bg-mansablue/5 transition-colors">
              List Your Business
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
