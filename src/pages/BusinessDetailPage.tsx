
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import SocialShareButtons from '@/components/common/SocialShareButtons';
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
  Users,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const businessId = Number(id);
  
  // Mock business data - in a real app, this would be fetched based on the ID
  const [business, setBusiness] = useState({
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
  });
  
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

  useEffect(() => {
    // Simulate loading business data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);
  
  const handleReviewSubmit = (rating: number, content: string) => {
    setShowReviewForm(false);
    toast("Review Submitted Successfully", {
      description: "Thank you for your feedback! You've earned 15 loyalty points."
    });
  };
  
  const handleCheckIn = () => {
    toast("Checked In!", {
      description: "You've successfully checked in at Soul Food Kitchen and earned 10 loyalty points!"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-xl mb-6"></div>
            <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-gray-200 h-64 rounded-xl mb-6"></div>
              </div>
              <div>
                <div className="bg-gray-200 h-32 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!business && !loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-8">The business you're looking for doesn't exist or has been removed.</p>
            <Link to="/directory">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Business Header */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-8">
          <div className="h-48 bg-gradient-to-r from-mansablue to-mansagold flex items-center justify-center">
            <span className="text-white text-6xl font-bold">{business.name.charAt(0)}</span>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-lg">{business.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <div className="flex items-center">
                    <div className="flex text-mansagold">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          fill={i < Math.floor(business.rating) ? "currentColor" : "none"} 
                          className={i < Math.floor(business.rating) ? "text-mansagold" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{business.rating} ({business.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1" />
                  {business.address}
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
                      <div className="w-48 h-48 border-2 border-mansablue flex items-center justify-center rounded-lg">
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
                      <DialogTitle>Share {business.name}</DialogTitle>
                      <DialogDescription>
                        Share this amazing Black-owned business with your network
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <SocialShareButtons
                        title={`Check out ${business.name} on Mansa Musa Marketplace`}
                        text={`I found this amazing Black-owned business: ${business.name} - ${business.description.substring(0, 100)}...`}
                        url={`${window.location.origin}/business/${business.id}`}
                        showLabels={true}
                        size="default"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
            <TabsTrigger value="reviews">Reviews ({business.reviewCount})</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">About {business.name}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{business.description}</p>
                  
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
                  <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive map coming soon</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">{business.address}</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-mansablue hover:underline"
                    >
                      <MapPin size={16} className="mr-1" />
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-mansablue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <a href={`tel:${business.phone}`} className="text-gray-600 hover:text-mansablue">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe size={18} className="text-mansablue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-mansablue hover:underline break-all">
                          {business.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-mansablue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{business.address}</p>
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
                    {Object.entries(business.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day === 'tue' ? 'Tuesday' : day === 'wed' ? 'Wednesday' : day === 'thu' ? 'Thursday' : day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : day === 'sun' ? 'Sunday' : 'Monday'}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
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
                  className="bg-mansablue hover:bg-mansablue/90"
                >
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow">
                    <span className="text-gray-400 text-2xl font-bold">{i + 1}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
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
