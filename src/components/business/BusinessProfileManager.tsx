
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, BarChart3, QrCode, Settings, Shield } from 'lucide-react';
import BusinessAnalyticsDashboard from './analytics/BusinessAnalyticsDashboard';
import QRCodeGenerator from './qr-code/QRCodeGenerator';

const BusinessProfileManager = () => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Mock business profile data
  const businessProfile = {
    id: '1',
    name: 'Soul Food Kitchen',
    description: 'Authentic Southern cuisine with family recipes',
    category: 'Restaurant',
    address: '123 Main St, Atlanta, GA',
    phone: '(404) 555-1234',
    website: 'https://soulfoodkitchen.example',
    email: 'info@soulfoodkitchen.com'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        <p className="text-muted-foreground">
          Manage your business profile, analytics, and engagement tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText size={16} />
            Details
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image size={16} />
            Images
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="qr-codes" className="flex items-center gap-2">
            <QrCode size={16} />
            QR Codes
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield size={16} />
            Verification
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={businessProfile.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Beauty">Beauty & Wellness</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 rows-4"
                  defaultValue={businessProfile.description}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={businessProfile.phone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={businessProfile.website}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={businessProfile.address}
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-mansablue text-white px-6 py-2 rounded-md hover:bg-mansablue-dark">
                Save Changes
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Business Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Upload your business logo</p>
                  <button className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
                    Choose File
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Banner Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Upload a banner image</p>
                  <button className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md">
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <BusinessAnalyticsDashboard businessId={businessProfile.id} />
        </TabsContent>

        <TabsContent value="qr-codes" className="mt-6">
          <QRCodeGenerator businessId={businessProfile.id} />
        </TabsContent>
        
        <TabsContent value="verification" className="mt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Business Verification</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-green-800">Verification Status</h3>
                  <p className="text-sm text-green-600">Your business is verified</p>
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Verified businesses receive a badge and appear higher in search results.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Business Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Notification Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Email notifications for new reviews
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    QR code scan notifications
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Marketing emails
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Privacy Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Show business in directory
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Allow customer reviews
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessProfileManager;
