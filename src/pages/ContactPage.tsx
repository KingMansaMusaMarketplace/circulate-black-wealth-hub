
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8 text-center">Contact Us</h1>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-mansablue mr-4" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contact@mansamusamarketplace.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-mansablue mr-4" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">312.709.6006</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-mansablue mr-4" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">1000 E. 111th Street, Suite 1100<br />Chicago, Illinois 60628</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="w-full p-3 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-md"></textarea>
                </div>
                <button type="submit" className="w-full bg-mansablue text-white py-3 rounded-md hover:bg-mansablue-dark transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
