
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-mansablue-dark text-white pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-mansagold flex items-center justify-center">
                <span className="text-mansablue-dark font-spartan font-bold text-xl">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-spartan font-bold text-lg leading-none">Mansa Musa</span>
                <span className="text-xs text-gray-300">Marketplace</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering Black communities to circulate wealth intentionally, build economic resilience, and create generational prosperity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-mansagold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-white hover:text-mansagold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-white hover:text-mansagold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-spartan font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-mansagold transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-mansagold transition-colors">About</Link></li>
              <li><Link to="/directory" className="text-gray-300 hover:text-mansagold transition-colors">Directory</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-mansagold transition-colors">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-spartan font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 hover:text-mansagold transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-mansagold transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-mansagold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-mansagold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
