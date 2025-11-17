
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
    <footer className="relative bg-gradient-to-br from-mansablue-dark via-blue-800 to-blue-900 text-white py-16 border-t border-white/20 overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-mansagold/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center mb-4 group">
              <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-mansagold mr-3 shadow-2xl bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-mansagold/50">
                <img 
                  src={mansaMusaLogo} 
                  alt="Mansa Musa Marketplace" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-6 max-w-md leading-relaxed font-bold text-lg">
              Empowering Black-owned businesses and building community wealth through every purchase.
            </p>
            <div className="space-y-3">
              <div className="flex items-center group">
                <div className="bg-gradient-to-r from-mansagold to-amber-500 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <button 
                  onClick={handleEmailClick}
                  className="text-white/90 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full font-medium"
                >
                  contact@mansamusamarketplace.com
                </button>
              </div>
              <div className="flex items-center group">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <button 
                  onClick={handlePhoneClick}
                  className="text-white/90 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full font-medium"
                >
                  (312) 709-6006
                </button>
              </div>
              <div className="flex items-center group cursor-pointer" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=1000+E.+111th+St.+Suite+1100+Chicago+Illinois+60628', '_blank')}>
                <div className="bg-gradient-to-r from-mansagold to-yellow-600 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="text-white/90 group-hover:text-mansagold transition-all duration-300 font-medium">
                  <div>1000 E. 111th St. Suite 1100</div>
                  <div>Chicago, Illinois 60628</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h4 className="font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Directory
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/community-impact" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Impact
                </Link>
              </li>
              {!isIOS && (
                <li>
                  <Link to="/business-signup" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                    Business Signup
                  </Link>
                </li>
              )}
              <li>
                <Link to="/business/how-it-works" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  How Payments Work
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Customer Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h4 className="font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/sales-agent" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Sales Agent
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  QR Scanner
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Rewards
                </Link>
              </li>
              <li>
                <Link to="/sponsor-pricing" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Become a Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h4 className="font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Resources & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Support
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/help')}
                  className="text-white/80 hover:text-mansagold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full text-left font-medium"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/accessibility" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex gap-4 mb-4 md:mb-0">
            <button 
              onClick={() => window.open('https://facebook.com', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-6 w-6 text-white" />
            </button>
            <button 
              onClick={() => window.open('https://twitter.com', '_blank')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-400/50"
              aria-label="Visit our Twitter page"
            >
              <Twitter className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="text-white text-sm text-center md:text-right">
              <p className="font-bold text-lg bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">© 2025 Mansa Musa Marketplace, Inc. All rights reserved.</p>
              <p className="text-xs mt-2 text-white/80 font-medium">
                Incorporated in Illinois • File #75201745 • Registered Agent: Thomas Bowling •{' '}
                <a 
                  href="https://apps.ilsos.gov/corporatellc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-mansagold hover:text-amber-400 transition-colors underline font-semibold"
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
