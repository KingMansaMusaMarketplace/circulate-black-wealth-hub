
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Search, Book, MessageCircle, Phone } from 'lucide-react';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8 text-center">Help Center</h1>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for help..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mansablue"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Book className="h-12 w-12 text-mansablue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">Browse our comprehensive guides and tutorials</p>
              <button className="text-mansablue font-medium hover:underline">View Docs</button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <MessageCircle className="h-12 w-12 text-mansablue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600 mb-4">Connect with other users and get answers</p>
              <button className="text-mansablue font-medium hover:underline">Join Community</button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Phone className="h-12 w-12 text-mansablue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-gray-600 mb-4">Get direct help from our support team</p>
              <button className="text-mansablue font-medium hover:underline">Contact Support</button>
            </div>
          </div>
          
          <div className="bg-mansablue text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <p className="mb-6">Our support team is here to help you succeed</p>
            <button className="bg-white text-mansablue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
