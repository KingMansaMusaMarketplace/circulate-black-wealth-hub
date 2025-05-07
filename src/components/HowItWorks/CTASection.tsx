
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { ArrowUp, Users, Star, CircleDollarSign, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

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
    <section id="cta-section" className="py-16 bg-gradient-to-r from-mansablue to-mansablue-dark text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-mansagold/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="heading-lg mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ready to Start Circulating?
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto mb-8 text-white/80 text-lg"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Join Mansa Musa Marketplace today and become part of the movement to strengthen Black economic power.
          </motion.p>
          
          {/* Benefits */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="flex justify-center flex-wrap gap-6 mb-8"
          >
            <TooltipProvider>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full cursor-pointer transition-all"
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
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Browse Directory
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-10 text-white/70 text-sm flex items-center justify-center"
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
