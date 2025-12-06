import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CreditCard, Star, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';

const BookingAccessSection: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with Black-owned businesses in just a few taps'
    },
    {
      icon: Clock,
      title: 'Flexible Times',
      description: 'Find available slots that work with your schedule'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Pay securely online when you book your appointment'
    },
    {
      icon: Star,
      title: 'Earn Points',
      description: 'Get loyalty points with every booking you complete'
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Book Services Online
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Schedule Appointments with{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Black-Owned Businesses
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From haircuts to consultations, book services directly through our platform and support your community
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center space-y-4">
            <Link to="/directory">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Browse & Book Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400">
              Businesses: <Link to="/business-dashboard" className="text-emerald-400 hover:underline">Add your services</Link> to start accepting bookings
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BookingAccessSection;
