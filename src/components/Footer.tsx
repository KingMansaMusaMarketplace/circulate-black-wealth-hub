
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/navbar/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Social media links - update these with your actual social media URLs
  const socialLinks = {
    facebook: 'https://facebook.com/mansamusamarketplace',
    twitter: 'https://twitter.com/mansamusamarketplace', 
    instagram: 'https://instagram.com/mansamusamarketplace',
    linkedin: 'https://linkedin.com/company/mansamusamarketplace'
  };

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-gray-700/50 pb-12">
          {/* Column 1: Logo and mission */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-gray-300 mt-6 max-w-md leading-relaxed">
              Building, protecting, and expanding the Black economic ecosystem through 
              intentional consumer behavior, loyalty rewards, and strategic digital infrastructure.
            </p>
            <div className="flex space-x-3 mt-8">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/15 text-white bg-white/10 transition-all" 
                aria-label="Facebook"
                onClick={() => handleSocialClick('Facebook', socialLinks.facebook)}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/15 text-white bg-white/10 transition-all" 
                aria-label="Twitter"
                onClick={() => handleSocialClick('Twitter', socialLinks.twitter)}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/15 text-white bg-white/10 transition-all" 
                aria-label="Instagram"
                onClick={() => handleSocialClick('Instagram', socialLinks.instagram)}
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/15 text-white bg-white/10 transition-all" 
                aria-label="LinkedIn"
                onClick={() => handleSocialClick('LinkedIn', socialLinks.linkedin)}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-mansagold border-b border-mansagold/30 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Business Directory", path: "/directory" },
                { name: "Education Center", path: "/education" },
                { name: "How It Works", path: "/how-it-works" },
                { name: "Community", path: "/community" },
                { name: "Plans", path: "/subscription" },
                { name: "About Us", path: "/about" }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-300 hover:text-white transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 text-mansagold-light opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: For Businesses */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-mansagold border-b border-mansagold/30 pb-2 inline-block">
              For Businesses
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Sign Up", path: "/signup?type=business" },
                { name: "Sales Agent Program", path: "/sales-agent" },
                { name: "Corporate Sponsorship", path: "/sponsorship" },
                { name: "Success Stories", path: "/case-studies" },
                { name: "FAQ", path: "/faq" }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-300 hover:text-white transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-2 text-mansagold-light opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-mansagold border-b border-mansagold/30 pb-2 inline-block">
              Contact & Legal
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-3 text-mansagold-light flex-shrink-0 mt-1" />
                <a 
                  href="mailto:contact@mansamusamarketplace.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  contact@mansamusamarketplace.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-3 text-mansagold-light flex-shrink-0 mt-1" />
                <a 
                  href="tel:+13127096006"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  312.709.6006
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-mansagold-light flex-shrink-0 mt-1" />
                <span className="text-gray-300 hover:text-white transition-colors">1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628</span>
              </li>
              <li className="mt-6">
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Mansa Musa Marketplace. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto" asChild>
              <Link to="/help">Help Center</Link>
            </Button>
            <span className="text-gray-600 text-xs">•</span>
            <Button variant="link" className="text-gray-400 hover:text-white text-sm p-0 h-auto" asChild>
              <Link to="/blog">Blog</Link>
            </Button>
            <span className="text-gray-600 text-xs">•</span>
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
