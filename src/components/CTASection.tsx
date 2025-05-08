
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AudioButton } from '@/components/ui/audio-button';

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
    }, { threshold: 0.2 });
    
    const section = document.querySelector('#main-cta');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleSignupClick = () => {
    toast({
      title: "Welcome!",
      description: "Thank you for your interest in joining our movement.",
      duration: 3000,
    });
  };

  return (
    <section id="main-cta" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-mansagold/10 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              variants={itemVariants}
              className="heading-lg mb-6"
            >
              Your Dollar Is Powerful.<br />Use It Intentionally.
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-white/80 max-w-xl mx-auto mb-8 text-lg"
            >
              Join Mansa Musa Marketplace today and become part of a movement that's building economic sovereignty one transaction at a time.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                <div className="flex items-center justify-center bg-white/10 px-4 py-2 rounded-lg">
                  <Check size={16} className="text-mansagold mr-2" />
                  <span>Save 10-20% on every purchase</span>
                </div>
                <div className="flex items-center justify-center bg-white/10 px-4 py-2 rounded-lg">
                  <Check size={16} className="text-mansagold mr-2" />
                  <span>Earn valuable loyalty points</span>
                </div>
                <div className="flex items-center justify-center bg-white/10 px-4 py-2 rounded-lg">
                  <Check size={16} className="text-mansagold mr-2" />
                  <span>Support Black economic power</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/signup">
                <AudioButton 
                  onClick={handleSignupClick} 
                  className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg font-medium group"
                  audioSrc="/audio/welcome-audio.wav"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </AudioButton>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
