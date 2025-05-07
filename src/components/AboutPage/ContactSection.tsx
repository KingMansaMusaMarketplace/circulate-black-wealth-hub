
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

const ContactSection = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={variants}
          className="text-center mb-12"
        >
          <h2 className="heading-md text-mansablue mb-4">Contact Us</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to learn more? Reach out to us and we'll respond as soon as possible.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
          
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600">
            Need immediate assistance? <Button variant="link" className="p-0 h-auto text-mansablue">Schedule a call with our team</Button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
