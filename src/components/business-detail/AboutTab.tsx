import React from 'react';
import { Calendar, Users, MapPin, Clock, Phone, Globe } from 'lucide-react';
import { Business } from '@/types/business';
import BusinessLocationMap from './BusinessLocationMap';

interface AboutTabProps {
  business: Business;
}

const AboutTab: React.FC<AboutTabProps> = ({ business }) => {
  const hasValidCoordinates = business.lat !== 0 && business.lng !== 0;

  return (
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
              <p className="text-gray-600">2015</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users size={18} className="text-mansablue" />
                Category
              </h3>
              <p className="text-gray-600">{business.category}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Business Location</h2>
          {hasValidCoordinates ? (
            <BusinessLocationMap
              lat={business.lat}
              lng={business.lng}
              businessName={business.name}
              address={business.address}
              city={business.city}
              state={business.state}
            />
          ) : (
            <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Location not available</p>
              </div>
            </div>
          )}
          <div className="text-center mt-4">
            <p className="text-gray-600 mb-4">{business.address}, {business.city}, {business.state} {business.zipCode}</p>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(`${business.address}, ${business.city}, ${business.state}`)}`}
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
                <p className="text-gray-600">{business.address}, {business.city}, {business.state}</p>
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
              <span className="text-gray-600">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tuesday</span>
              <span className="text-gray-600">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Wednesday</span>
              <span className="text-gray-600">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Thursday</span>
              <span className="text-gray-600">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Friday</span>
              <span className="text-gray-600">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saturday</span>
              <span className="text-gray-600">10:00 AM - 7:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sunday</span>
              <span className="text-gray-600">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
