
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, MapPin, Phone, Globe, Award, Star, Share2 } from 'lucide-react';
import { Business } from '@/types/business';
import { toast } from 'sonner';
import SocialShareButtons from '@/components/common/SocialShareButtons';

interface BusinessDetailHeaderProps {
  business: Business;
}

const BusinessDetailHeader: React.FC<BusinessDetailHeaderProps> = ({ business }) => {
  const handleCheckIn = () => {
    toast("Checked In!", {
      description: `You've successfully checked in at ${business.name} and earned 10 loyalty points!`
    });
  };

  return (
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
              {business.address}, {business.city}, {business.state}
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
  );
};

export default BusinessDetailHeader;
