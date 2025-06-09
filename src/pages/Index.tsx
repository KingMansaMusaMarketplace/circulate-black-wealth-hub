
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star, Users, Building2, GraduationCap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mansablue to-mansablue-dark min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          {/* Top Subscription Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link to="/signup">
              <Badge className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Start FREE
              </Badge>
            </Link>
            <Link to="/subscription">
              <Badge className="bg-mansagold hover:bg-mansagold/90 text-mansablue px-6 py-3 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Premium $10/month
              </Badge>
            </Link>
            <Link to="/signup">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium">
                <GraduationCap className="w-4 h-4 mr-2" />
                FREE Premium for HBCU
              </Badge>
            </Link>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {/* Main Headline */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Save Money &{' '}
                <br />
                Support{' '}
                <span className="text-mansagold">Black-Owned Businesses</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
                Start FREE - Get 10% - 20% discounts while building community wealth!
              </p>
              
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Join thousands of customers discovering amazing businesses and making every 
                purchase count toward building generational wealth.
              </p>
            </div>

            {/* Subscription Plans */}
            <div className="space-y-4 max-w-2xl mx-auto w-full mb-8">
              {/* Free Membership */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge variant="secondary" className="bg-gray-500 text-white mr-3">
                      FREE
                    </Badge>
                    <span className="text-white font-bold text-lg">FREE MEMBERSHIP:</span>
                  </div>
                  <p className="text-white/90">
                    Browse directory, discover businesses, view profiles
                  </p>
                </CardContent>
              </Card>

              {/* Premium Membership */}
              <Card className="bg-white/10 border-mansagold/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-mansagold text-mansablue mr-3">
                      💰
                    </Badge>
                    <span className="text-white font-bold text-lg">PREMIUM ($10/month):</span>
                  </div>
                  <p className="text-white/90">
                    Get 10% - 20% discounts, earn points, redeem rewards, 
                    exclusive deals, premium support, mentorship access, advanced networking
                  </p>
                </CardContent>
              </Card>

              {/* HBCU Special */}
              <Card className="bg-white/10 border-blue-300/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-blue-500 text-white mr-3">
                      🎓
                    </Badge>
                    <span className="text-white font-bold text-lg">HBCU STUDENTS & STAFF:</span>
                  </div>
                  <p className="text-white/90 mb-2">
                    Get ALL Premium features FREE with verification!
                  </p>
                  <p className="text-white/70 text-sm">
                    Upload student ID or staff credentials during signup
                  </p>
                </CardContent>
              </Card>

              {/* Business Owners */}
              <Card className="bg-white/10 border-green-300/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-green-500 text-white mr-3">
                      🏢
                    </Badge>
                    <span className="text-white font-bold text-lg">BUSINESS OWNERS:</span>
                  </div>
                  <p className="text-white/90 mb-2">
                    First month FREE! Connect with loyal customers
                  </p>
                  <p className="text-white/70 text-sm">
                    $100/month after trial period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action Buttons */}
            <div className="space-y-4 max-w-lg mx-auto w-full">
              <Link to="/signup" className="block">
                <Button className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-bold py-4 text-lg rounded-lg">
                  Start FREE Today
                </Button>
              </Link>
              
              <Link to="/directory" className="block">
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white hover:text-mansablue py-4 text-lg rounded-lg"
                >
                  Browse Directory
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom Image */}
          <div className="mt-8 rounded-2xl overflow-hidden max-w-2xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
              alt="Black women using laptops for business" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
