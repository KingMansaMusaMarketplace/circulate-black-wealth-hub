
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
    <section className="py-12 lg:py-16 bg-gray-50 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large blurred backgrounds */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-mansablue/5 blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-mansagold/5 blur-xl"></div>
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="pattern-diagonal h-full"></div>
        </div>
        
        {/* Small decorative elements */}
        <div className="absolute top-1/4 right-10 w-3 h-3 rounded-full bg-mansablue/20"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-mansagold/30"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-px bg-gradient-to-r from-mansablue/0 via-mansablue/20 to-mansablue/0"></div>
      </div>
      
      <div className="container-custom">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={variants}
          className="text-center mb-10 relative"
        >
          <h2 className="heading-md text-mansablue mb-3">Contact Us</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-5"></div>
          <p className="text-gray-600 max-w-2xl mx-auto px-4">
            Have questions or want to learn more? Reach out to us and we'll respond as soon as possible.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
          <div className="lg:col-span-1">
            <ContactInfo />
            
            {/* Add decorative elements */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Office Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        <div className="text-center mt-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600">
              Need immediate assistance? <Button variant="link" className="p-0 h-auto text-mansablue">Schedule a call with our team</Button>
            </p>
          </motion.div>
        </div>
        
        {/* Add map preview */}
        <div className="mt-12 max-w-6xl mx-auto px-4">
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="bg-gray-100 rounded h-48 w-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-mansablue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-mansablue"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Map loading...</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            Find us at our Atlanta, GA headquarters
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
