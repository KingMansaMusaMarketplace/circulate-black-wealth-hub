import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { motion } from 'framer-motion';

interface ContactInfoItem {
  id: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  value: string;
  link?: string;
  description: string;
}

const ContactInfo = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);

  const contactInfo: ContactInfoItem[] = [
    {
      id: 'email',
      title: 'Email',
      icon: Mail,
      value: 'contact@mansamusamarketplace.com',
      link: 'mailto:contact@mansamusamarketplace.com',
      description: 'Email us anytime for general inquiries or partnership opportunities.'
    },
    {
      id: 'phone',
      title: 'Telephone',
      icon: Phone,
      value: '312.709.6006',
      link: 'tel:3127096006',
      description: 'Available Monday to Friday from 9am to 5pm CST.'
    },
    {
      id: 'address',
      title: 'Office',
      icon: MapPin,
      value: '1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628',
      description: "Visit us in Chicago's historic Pullman district."
    }
  ];

  return (
    <Card className="h-full border-mansagold/20">
      <CardContent className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-mansablue mb-6">Get In Touch</h3>
        
        <div className="space-y-4">
          {contactInfo.map((item) => (
            <Popover key={item.id}>
              <PopoverTrigger asChild>
                <motion.div 
                  className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                    activeContact === item.id ? 'bg-mansablue text-white' : 'hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveContact(item.id === activeContact ? null : item.id)}
                >
                  <div className={`min-w-10 h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${
                    activeContact === item.id ? 'bg-white text-mansablue' : 'bg-mansablue text-white'
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        className={`${activeContact === item.id ? "text-white/80" : "text-mansablue hover:text-mansagold transition-colors"} block truncate`}
                      >
                        <span className="truncate block">{item.value}</span>
                      </a>
                    ) : (
                      <address className="not-italic text-sm text-gray-600 truncate">
                        {item.value}
                      </address>
                    )}
                  </div>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-80 p-4">
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.link && (
                  <a 
                    href={item.link} 
                    className="text-mansablue hover:text-mansagold transition-colors text-sm block mt-2 break-all"
                  >
                    {item.value}
                  </a>
                )}
              </PopoverContent>
            </Popover>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h4 className="font-bold mb-3">Follow Us</h4>
          <div className="flex space-x-3">
            <Button size="icon" variant="outline" className="rounded-full hover:bg-mansablue hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:bg-mansablue hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:bg-mansablue hover:text-white">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
