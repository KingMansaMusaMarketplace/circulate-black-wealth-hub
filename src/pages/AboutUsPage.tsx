
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8">About Mansa Musa Marketplace</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Mansa Musa Marketplace is dedicated to empowering Black-owned businesses and strengthening community wealth through strategic economic circulation.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Named after Mansa Musa, the legendary African emperor known for his incredible wealth and economic influence, our platform continues his legacy by creating pathways for Black economic empowerment in the modern era.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create a thriving ecosystem where Black-owned businesses can flourish and community members can easily discover and support these enterprises.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To build the largest network of Black-owned businesses and conscious consumers, creating lasting economic impact in communities nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
