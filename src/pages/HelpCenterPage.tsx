
import React from 'react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const HelpCenterPage = () => {
  return (
    <ResponsiveLayout
      title="Help Center"
      description="Get help and support for using Mansa Musa Marketplace"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to your questions and get support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-mansablue mb-4">Getting Started</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• How to create an account</li>
              <li>• Setting up your business profile</li>
              <li>• Understanding loyalty points</li>
              <li>• Using QR codes</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-mansablue mb-4">Account & Billing</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Managing your subscription</li>
              <li>• Payment methods</li>
              <li>• Account settings</li>
              <li>• Privacy controls</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-mansablue mb-4">Business Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• QR code management</li>
              <li>• Analytics dashboard</li>
              <li>• Customer engagement</li>
              <li>• Verification process</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-mansablue mb-4">Contact Support</h2>
            <div className="space-y-2 text-gray-600">
              <p>Email: contact@mansamusamarketplace.com</p>
              <p>Phone: 312.709.6006</p>
              <p>Business Hours: Mon-Fri 9AM-6PM CST</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default HelpCenterPage;
