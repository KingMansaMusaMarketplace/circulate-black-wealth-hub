
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
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-rose-400/20 to-pink-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/10 to-rose-400/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-3xl mx-auto mb-8">
              See how businesses and customers are thriving together in our marketplace
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Avg. 35% Revenue Increase</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-full shadow-lg border-2 border-blue-200">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Building to 1M Members</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-2 rounded-full shadow-lg border-2 border-amber-200">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">4.9/5 Satisfaction</span>
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
              <Card className="h-full border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50 to-rose-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  {/* Header with Avatar and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-orange-300 ring-offset-2">
                        <AvatarImage src={testimonial.image} alt={testimonial.author} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">{testimonial.author}</p>
                        <p className="text-sm text-gray-700 font-medium">{testimonial.role}</p>
                        {testimonial.location && (
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={testimonial.type === 'business' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none shadow-lg' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none shadow-lg'}
                    >
                      {testimonial.type === 'business' ? 'Business' : 'Customer'}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-800 italic mb-4 leading-relaxed font-medium border-l-4 border-gradient-to-b from-orange-400 to-rose-400 pl-4">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Metrics */}
                  {testimonial.type === 'business' && testimonial.metrics && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-300 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{testimonial.metrics.metric}</span>
                        <span className="text-lg font-extrabold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                          +{testimonial.metrics.increase}
                        </span>
                      </div>
                    </div>
                  )}

                  {testimonial.type === 'customer' && testimonial.points && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-blue-300 shadow-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Points Earned</span>
                        <span className="font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">{testimonial.points}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Money Saved</span>
                        <span className="font-extrabold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">{testimonial.saved}</span>
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
          <p className="text-lg font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-6">
            Ready to help us build a 1 million member community?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white px-8 py-3 rounded-lg font-bold hover:from-amber-700 hover:via-orange-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Start Your Journey
            </button>
            <button className="border-2 border-orange-500 bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 transition-all shadow-md hover:shadow-lg">
              List Your Business
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
