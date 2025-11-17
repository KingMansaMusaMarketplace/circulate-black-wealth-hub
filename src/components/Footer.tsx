
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';
import { useCapacitor } from '@/hooks/use-capacitor';

const Footer = () => {
  const navigate = useNavigate();
  const { platform } = useCapacitor();
  const isIOS = platform === 'ios';

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@mansamusamarketplace.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+1-312-709-6006';
  };

  return (
    <footer className="bg-gradient-to-br from-mansablue-dark via-mansablue-dark to-mansablue text-white py-12 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mansagold/30 mr-3 shadow-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-mansagold/50 group-hover:shadow-xl group-hover:scale-105">
                <img 
                  src={mansaMusaLogo} 
                  alt="Mansa Musa Marketplace" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-mansagold">Mansa Musa Marketplace</h3>
            </div>
            <p className="text-foreground/70 mb-4 max-w-md leading-relaxed">
              Empowering Black-owned businesses and building community wealth through every purchase.
            </p>
            <div className="space-y-2">
              <div className="flex items-center group">
                <Mail className="h-4 w-4 mr-2 text-mansagold transition-transform duration-300 group-hover:scale-110" />
                <button 
                  onClick={handleEmailClick}
                  className="text-foreground/70 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full"
                >
                  contact@mansamusamarketplace.com
                </button>
              </div>
              <div className="flex items-center group">
                <Phone className="h-4 w-4 mr-2 text-mansagold transition-transform duration-300 group-hover:scale-110" />
                <button 
                  onClick={handlePhoneClick}
                  className="text-foreground/70 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full"
                >
                  (312) 709-6006
                </button>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-mansagold" />
                <div className="text-foreground/70">
                  <div>1000 E. 111th St. Suite 1100</div>
                  <div>Chicago, Illinois 60628</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-mansagold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/community-impact" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Impact
                </Link>
              </li>
              {!isIOS && (
                <li>
                  <Link to="/business-signup" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                    Business Signup
                  </Link>
                </li>
              )}
              <li>
                <Link to="/business/how-it-works" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  How Payments Work
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Customer Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-mansagold">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Sales Agent
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  QR Scanner
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Rewards
                </Link>
              </li>
              <li>
                <Link to="/sponsor-pricing" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Become a Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-mansagold">Resources & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Support
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/help')}
                  className="text-foreground/70 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/accessibility" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-foreground/70 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-mansagold/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 md:mb-0">
            <button 
              onClick={() => window.open('https://facebook.com', '_blank')}
              className="text-foreground/70 hover:text-mansagold transition-all duration-300 hover:scale-110 hover:rotate-6"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-6 w-6" />
            </button>
            <button 
              onClick={() => window.open('https://twitter.com', '_blank')}
              className="text-foreground/70 hover:text-mansagold transition-all duration-300 hover:scale-110 hover:rotate-6"
              aria-label="Visit our Twitter page"
            >
              <Twitter className="h-6 w-6" />
            </button>
            <button 
              onClick={() => window.open('https://instagram.com', '_blank')}
              className="text-foreground/70 hover:text-mansagold transition-all duration-300 hover:scale-110 hover:rotate-6"
              aria-label="Visit our Instagram page"
            >
              <Instagram className="h-6 w-6" />
            </button>
            <button 
              onClick={() => window.open('https://linkedin.com', '_blank')}
              className="text-foreground/70 hover:text-mansagold transition-all duration-300 hover:scale-110 hover:rotate-6"
              aria-label="Visit our LinkedIn page"
            >
              <Linkedin className="h-6 w-6" />
            </button>
          </div>
          <div className="text-foreground/70 text-sm text-center md:text-right">
              <p className="font-semibold text-foreground">© 2025 Mansa Musa Marketplace, Inc. All rights reserved.</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Incorporated in Illinois • File #75201745 • Registered Agent: Thomas Bowling •{' '}
                <a 
                  href="https://apps.ilsos.gov/corporatellc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-mansagold hover:text-mansagold/80 transition-colors underline"
                >
                  Verify
                </a>
              </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
