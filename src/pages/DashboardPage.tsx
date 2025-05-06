
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Search, QrCode, Star } from 'lucide-react';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import QRCodeScanner from '@/components/QRCodeScanner';
import BusinessCard from '@/components/BusinessCard';

const DashboardPage = () => {
  // Mock user data
  const userData = {
    name: "Jasmine Williams",
    loyaltyPoints: 350,
    targetPoints: 500,
    totalSaved: 120
  };

  // Mock nearby businesses
  const nearbyBusinesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      discount: "15% off",
      rating: 4.8,
      reviewCount: 124,
      distance: "0.5"
    },
    {
      id: 2,
      name: "Prestigious Cuts",
      category: "Barber Shop",
      discount: "10% off",
      rating: 4.9,
      reviewCount: 207,
      distance: "0.7"
    },
    {
      id: 3,
      name: "Heritage Bookstore",
      category: "Retail",
      discount: "20% off",
      rating: 4.7,
      reviewCount: 89,
      distance: "1.2"
    }
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      businessName: "Soul Food Kitchen",
      action: "Scan",
      points: 15,
      date: "Today"
    },
    {
      id: 2,
      businessName: "Prestigious Cuts",
      action: "Review",
      points: 25,
      date: "3 days ago"
    },
    {
      id: 3,
      businessName: "Heritage Bookstore",
      action: "Scan",
      points: 10,
      date: "1 week ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-mansablue-dark">
            Welcome back, {userData.name}!
          </h1>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-1" />
            <span>Atlanta, GA</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - User stats and QR Scanner */}
          <div className="md:col-span-1 space-y-6">
            <LoyaltyPointsCard 
              points={userData.loyaltyPoints} 
              target={userData.targetPoints} 
              saved={userData.totalSaved} 
            />
            <QRCodeScanner />
          </div>

          {/* Right columns - Nearby businesses and activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Nearby Businesses */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Nearby Businesses</h2>
                <Link to="/directory" className="text-mansablue text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search for a business" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {nearbyBusinesses.map(business => (
                  <div key={business.id} className="border border-gray-100 rounded-lg p-4 flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-gray-500 font-bold text-lg">{business.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{business.name}</h3>
                      <div className="flex items-center text-gray-500 text-xs">
                        <span>{business.category}</span>
                        <span className="mx-2">•</span>
                        <span>{business.distance} miles away</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-mansagold font-bold">{business.discount}</span>
                      <div className="flex items-center justify-end mt-1">
                        <Star size={12} className="text-mansagold fill-mansagold" />
                        <span className="text-xs text-gray-500 ml-1">{business.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.action === 'Scan' ? 'bg-mansablue/10 text-mansablue' : 'bg-mansagold/10 text-mansagold'}`}>
                      {activity.action === 'Scan' ? <QrCode size={16} /> : <Star size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action} at {activity.businessName}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <div className="bg-mansagold/10 text-mansagold font-medium text-sm px-2 py-1 rounded">
                    +{activity.points} points
                  </div>
                </div>
              ))}

              <div className="mt-6 text-center">
                <Button variant="outline" className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white">
                  View Full History
                </Button>
              </div>
            </div>

            {/* Economic Impact */}
            <div className="bg-mansablue rounded-xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Your Circulation Impact</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">$120</p>
                  <p className="text-xs">Total Saved</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs">Businesses Supported</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs">Total Scans</p>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Every time you scan and support a Black-owned business, you help extend the circulation of Black dollars in our community.
              </p>
              <div className="flex justify-center">
                <Button className="bg-mansagold hover:bg-mansagold-dark text-white">
                  Share Your Impact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
