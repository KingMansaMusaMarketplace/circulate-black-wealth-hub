
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/navbar/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-12">
          {/* Column 1: Logo and mission */}
          <div className="lg:col-span-2">
            <Logo className="text-white mb-6" />
            <p className="text-gray-300 mt-4 max-w-md">
              Building, protecting, and expanding the Black economic ecosystem through 
              intentional consumer behavior, loyalty rewards, and strategic digital infrastructure.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-mansagold">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-gray-300 hover:text-white transition-colors">
                  Loyalty Program
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: For Businesses */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-mansagold">
              For Businesses
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/business-signup" className="text-gray-300 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="text-gray-300 hover:text-white transition-colors">
                  Become a Sales Agent
                </Link>
              </li>
              <li>
                <Link to="/corporate-sponsorship" className="text-gray-300 hover:text-white transition-colors">
                  Corporate Sponsorship
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-300 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-mansagold">
              Contact & Legal
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-mansagold-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">support@mansamusa.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-mansagold-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-mansagold-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Atlanta, GA</span>
              </li>
              <li className="mt-4">
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Mansa Musa Marketplace. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto" asChild>
              <Link to="/help">Help Center</Link>
            </Button>
            <span className="text-gray-600 mx-2">•</span>
            <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto" asChild>
              <Link to="/blog">Blog</Link>
            </Button>
            <span className="text-gray-600 mx-2">•</span>
            <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto" asChild>
              <Link to="/cookies">Cookie Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
