
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { useCapacitor } from '@/hooks/use-capacitor';
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

const Footer = () => {
  const navigate = useNavigate();
  const { platform } = useCapacitor();
  const isIOS = platform === 'ios';

  const handleEmailClick = () => {
    window.location.href = 'mailto:Thomas@1325.AI';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+1-312-709-6006';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-16 border-t border-white/10 overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-mansagold/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-mansagold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-50" />
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center mb-4 group">
              <div className="w-16 h-16 mr-3 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]">
                <img 
                  src={logo1325} 
                  alt="1325.AI" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-mansagold font-mono text-sm tracking-wider mb-2">
              Building the Future of Digital Commerce | AI
            </p>
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
                  Thomas@1325.AI
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
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h4 className="font-heading font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Quick Links</h4>
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
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h4 className="font-heading font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Learning Hub
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
              <li>
                <Link to="/media-kit" className="text-white/80 hover:text-mansagold transition-all duration-300 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-mansagold after:transition-all after:duration-300 hover:after:w-full hover:translate-x-1 font-medium">
                  Media Kit
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources & Legal */}
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h4 className="font-heading font-bold mb-4 text-xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">Resources & Legal</h4>
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
          </motion.div>
        </div>

        {/* Sponsor Logos Section */}
        <motion.div variants={itemVariants} className="mt-10 mb-8">
          <SponsorLogoGrid 
            placement="footer" 
            maxLogos={6} 
            variant="dark"
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          />
        </motion.div>

        {/* Social Media & Copyright */}
        <motion.div variants={itemVariants} className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex gap-4 mb-4 md:mb-0">
            <button 
              onClick={() => window.open('https://facebook.com', '_blank')}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl border border-white/10"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={() => window.open('https://twitter.com', '_blank')}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl border border-white/10"
              aria-label="Visit our Twitter page"
            >
              <Twitter className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="text-white text-sm text-center md:text-right">
              <p className="font-heading font-bold text-lg bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent">© 2026 Mansa Musa Marketplace, Inc. All rights reserved. U.S. Patent Pending 63/969,202.</p>
              <p className="text-xs mt-2 text-white/60 font-medium">
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
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
