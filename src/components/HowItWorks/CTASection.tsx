
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { ArrowUp, Users, Star, CircleDollarSign, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/sonner'; // Updated import path

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const section = document.querySelector('#cta-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [controls]);

  const benefits = [
    {
      icon: <Users className="h-5 w-5" />,
      text: "Join 10,000+ members",
      tooltip: "Be part of the fastest-growing Black economic movement"
    },
    {
      icon: <Star className="h-5 w-5" />,
      text: "Access exclusive deals",
      tooltip: "Save 10-20% at every participating business"
    },
    {
      icon: <CircleDollarSign className="h-5 w-5" />,
      text: "Earn loyalty points",
      tooltip: "Redeem points for real rewards and discounts"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleEarlyAccess = () => {
    toast({
      title: "Early Access",
      description: "You've been added to our early access waitlist!",
      duration: 3000,
    });
  };

  return (
    <section id="cta-section" className="py-14 bg-gradient-to-r from-mansablue to-mansablue-dark text-white text-center relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Larger blurred elements */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-mansagold/5 blur-2xl"></div>
        
        {/* Small decorative elements */}
        <div className="absolute top-10 right-1/4 w-4 h-4 rounded-full bg-white/10"></div>
        <div className="absolute top-1/3 right-10 w-6 h-6 rounded-full border border-white/10"></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-mansagold/30"></div>
        
        {/* Line decorations */}
        <div className="absolute top-20 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Dots pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-5">
          <div className="pattern-dots h-full"></div>
        </div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="heading-lg mb-5 relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ready to Start Circulating?
            <span className="absolute -top-6 -right-6 w-12 h-12 border border-mansagold/30 rounded-full hidden md:block"></span>
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto mb-6 text-white/80 text-lg"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Join Mansa Musa Marketplace today and become part of the movement to strengthen Black economic power.
          </motion.p>
          
          {/* Benefits with enhanced styling */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="flex justify-center flex-wrap gap-4 mb-8 relative"
          >
            {/* Decorative line connecting benefits */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-white/10 -z-10 hidden md:block"></div>
            
            <TooltipProvider>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full cursor-pointer transition-all border border-white/5 backdrop-blur-sm"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <span className="mr-2 text-mansagold">{benefit.icon}</span>
                        <span className="text-sm md:text-base">{benefit.text}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-mansagold text-white border-none">
                      <p>{benefit.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </TooltipProvider>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {/* Decorative elements behind buttons */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-white/5 rounded-full blur-xl hidden md:block"></div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Decorative glow effect */}
              <div className="absolute inset-0 bg-mansagold/20 rounded-md filter blur-md -z-10"></div>
              
              <Link to="/signup">
                <Button onClick={handleEarlyAccess} className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg group">
                  Get Early Access 
                  <ArrowUp className="ml-2 rotate-45 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/directory">
                <Button variant="outline" className="border-mansagold bg-mansagold/20 text-mansagold hover:bg-mansagold/30 px-8 py-6 text-lg">
                  Browse Directory
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-white/70 text-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Check size={16} className="text-mansagold mr-2" />
            No credit card required. Cancel your subscription anytime.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
