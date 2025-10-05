
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';

const Footer = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@mansamusamarketplace.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+1-312-709-6006';
  };

  return (
    <footer className="bg-mansablue-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-mansagold/30 mr-4 shadow-lg bg-white/10 backdrop-blur-sm">
                <img 
                  src={mansaMusaLogo} 
                  alt="Mansa Musa Marketplace" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Mansa Musa Marketplace</h3>
            </div>
            <p className="text-blue-100 mb-4 max-w-md">
              Empowering Black-owned businesses and building community wealth through every purchase.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <button 
                  onClick={handleEmailClick}
                  className="text-blue-100 hover:text-white transition-colors hover:underline"
                >
                  contact@mansamusamarketplace.com
                </button>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <button 
                  onClick={handlePhoneClick}
                  className="text-blue-100 hover:text-white transition-colors hover:underline"
                >
                  (312) 709-6006
                </button>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <div className="text-blue-100">
                  <div>1000 E. 111th St. Suite 1100</div>
                  <div>Chicago, Illinois 60628</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-blue-100 hover:text-white transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-blue-100 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/community-impact" className="text-blue-100 hover:text-white transition-colors">
                  Impact
                </Link>
              </li>
              <li>
                <Link to="/business-signup" className="text-blue-100 hover:text-white transition-colors">
                  Business Signup
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-blue-100 hover:text-white transition-colors">
                  Customer Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-blue-100 hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-blue-100 hover:text-white transition-colors">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="text-blue-100 hover:text-white transition-colors">
                  Sales Agent
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="text-blue-100 hover:text-white transition-colors">
                  QR Scanner
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-blue-100 hover:text-white transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link to="/corporate-sponsorship" className="text-blue-100 hover:text-white transition-colors">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="font-semibold mb-4">Resources & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-blue-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-blue-100 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/help')}
                  className="text-blue-100 hover:text-white transition-colors hover:underline text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/accessibility" className="text-blue-100 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-blue-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-blue-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button 
              onClick={() => window.open('https://facebook.com', '_blank')}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button 
              onClick={() => window.open('https://twitter.com', '_blank')}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Visit our Twitter page"
            >
              <Twitter className="h-5 w-5" />
            </button>
            <button 
              onClick={() => window.open('https://instagram.com', '_blank')}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Visit our Instagram page"
            >
              <Instagram className="h-5 w-5" />
            </button>
            <button 
              onClick={() => window.open('https://linkedin.com', '_blank')}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Visit our LinkedIn page"
            >
              <Linkedin className="h-5 w-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            © 2024 Mansa Musa Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
