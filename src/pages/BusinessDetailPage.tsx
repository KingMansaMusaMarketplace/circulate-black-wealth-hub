
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  QrCode, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Award,
  Star,
  Calendar,
  Share2,
  ThumbsUp,
  MessageSquare,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const businessId = Number(id);
  
  // Mock business data - in a real app, this would be fetched based on the ID
  const business = {
    id: businessId || 1,
    name: "Soul Food Kitchen",
    category: "Restaurant",
    discount: "15% off",
    discountValue: 15,
    rating: 4.8,
    reviewCount: 124,
    address: "123 Main St, Atlanta, GA",
    phone: "(404) 555-1234",
    website: "https://soulfoodkitchen.example",
    hours: {
      mon: "11AM - 9PM",
      tue: "11AM - 9PM",
      wed: "11AM - 9PM",
      thu: "11AM - 10PM",
      fri: "11AM - 11PM",
      sat: "10AM - 11PM",
      sun: "10AM - 8PM"
    },
    description: "Soul Food Kitchen offers authentic Southern cuisine with family recipes that have been passed down for generations. Our commitment to using fresh, locally sourced ingredients ensures that every meal is not only delicious but also supports our community farmers.",
    established: 2012,
    ownerName: "James Wilson"
  };
  
  // Mock reviews
  const reviews = [
    {
      id: 1,
      userName: "Jasmine W.",
      avatar: "",
      rating: 5,
      date: "2 days ago",
      content: "Absolutely amazing food and atmosphere! The service was exceptional and they made our anniversary dinner special. The mac and cheese is to die for!",
      helpful: 12,
      isVerified: true
    },
    {
      id: 2,
      userName: "Marcus L.",
      avatar: "",
      rating: 5,
      date: "1 week ago",
      content: "Best soul food in Atlanta, hands down! The cornbread was perfectly sweet and the portions are very generous. I'm so glad I found this place through the app.",
      helpful: 8,
      isVerified: true
    },
    {
      id: 3,
      userName: "Tanya R.",
      avatar: "",
      rating: 4,
      date: "3 weeks ago",
      content: "Great food and warm service. The only reason I'm not giving 5 stars is because it was quite busy and we had to wait about 30 minutes for a table. But the food was worth the wait!",
      helpful: 5,
      isVerified: true
    }
  ];
  
  const handleReviewSubmit = (rating: number, content: string) => {
    setShowReviewForm(false);
    // In a real app, this would send the review to an API
    toast("Review Submitted Successfully", {
      description: "Thank you for your feedback! You've earned 15 loyalty points."
    });
  };
  
  const handleCheckIn = () => {
    // Simulate check-in process
    toast("Checked In!", {
      description: "You've successfully checked in at Soul Food Kitchen and earned 10 loyalty points!"
    });
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container-custom py-8">
        {/* Business Header */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-8">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-5xl font-bold">{business.name.charAt(0)}</span>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500">{business.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <div className="flex items-center">
                    <div className="flex text-mansagold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < Math.floor(business.rating) ? "currentColor" : "none"} 
                          className={i < Math.floor(business.rating) ? "text-mansagold" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{business.rating} ({business.reviewCount})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleCheckIn}
                >
                  <Award size={16} />
                  Check In
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <QrCode size={16} />
                      Show QR
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QR Code for {business.name}</DialogTitle>
                      <DialogDescription>
                        Scan this QR code at checkout to earn loyalty points
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-6">
                      <div className="w-48 h-48 border-2 border-mansablue flex items-center justify-center">
                        <QrCode size={120} className="text-mansablue" />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Share2 size={16} />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share this business</DialogTitle>
                      <DialogDescription>
                        Copy the link or share directly on your social networks
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <input
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          value={`https://yourapp.com/business/${business.id}`}
                          readOnly
                        />
                      </div>
                      <Button type="submit" size="sm" className="px-3 bg-mansablue hover:bg-mansablue-dark">
                        Copy
                      </Button>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <Button variant="outline" size="sm">Facebook</Button>
                      <Button variant="outline" size="sm">Twitter</Button>
                      <Button variant="outline" size="sm">Instagram</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin size={16} className="mr-1" />
              {business.address}
            </div>
            
            <div className="bg-mansagold/10 text-mansagold font-medium text-sm px-4 py-2 rounded-md inline-block">
              {business.discount} for app users
            </div>
          </div>
        </div>
        
        {/* Business Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">About {business.name}</h2>
                  <p className="text-gray-600 mb-6">{business.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar size={18} className="text-mansablue" />
                        Established
                      </h3>
                      <p className="text-gray-600">{business.established}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users size={18} className="text-mansablue" />
                        Owned By
                      </h3>
                      <p className="text-gray-600">{business.ownerName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Business Location</h2>
                  <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin size={48} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-center">
                    Interactive map would be displayed here in a production app
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-mansablue mt-0.5" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-gray-600">{business.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe size={18} className="text-mansablue mt-0.5" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-mansablue hover:underline">
                          {business.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-mansablue mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{business.address}</p>
                        <a href={`https://maps.google.com/?q=${business.address}`} target="_blank" rel="noopener noreferrer" className="text-mansablue hover:underline text-sm">
                          Get Directions →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Clock size={18} />
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday</span>
                      <span>{business.hours.mon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tuesday</span>
                      <span>{business.hours.tue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Wednesday</span>
                      <span>{business.hours.wed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thursday</span>
                      <span>{business.hours.thu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Friday</span>
                      <span>{business.hours.fri}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span>{business.hours.sat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span>{business.hours.sun}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center mt-1">
                    <div className="flex text-mansagold mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          fill={i < Math.floor(business.rating) ? "currentColor" : "none"} 
                          className={i < Math.floor(business.rating) ? "text-mansagold" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{business.rating}</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-gray-600">{business.reviewCount} reviews</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowReviewForm(true)}
                  className="bg-mansablue hover:bg-mansablue-dark"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              </div>
              
              {showReviewForm && (
                <div className="mb-8 border-b pb-8">
                  <h3 className="text-lg font-medium mb-4">Your Review</h3>
                  <ReviewForm 
                    businessName={business.name} 
                    onSubmit={handleReviewSubmit}
                  />
                </div>
              )}
              
              <div className="space-y-6">
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              
              {reviews.length > 0 && (
                <div className="mt-6 pt-4 border-t flex justify-center">
                  <Button variant="outline">See All {business.reviewCount} Reviews</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="photos">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Business Photos</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300 text-3xl font-bold">{i + 1}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-center">
                <Button variant="outline">Upload Photos</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessDetailPage;
