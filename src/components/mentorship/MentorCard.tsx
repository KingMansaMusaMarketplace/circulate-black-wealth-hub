
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Clock, MessageCircle, Calendar } from 'lucide-react';
import { MentorProfile } from '@/types/mentorship';

interface MentorCardProps {
  mentor: MentorProfile;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  const availableSlots = mentor.mentoring_capacity - mentor.current_mentees;

  const handleConnect = () => {
    // TODO: Implement connection logic
    console.log('Connecting with mentor:', mentor.id);
  };

  const handleViewProfile = () => {
    // TODO: Implement profile view
    console.log('Viewing mentor profile:', mentor.id);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.profile_image} alt={mentor.user_name} />
            <AvatarFallback>
              {mentor.user_name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{mentor.user_name}</h3>
            <p className="text-sm text-gray-600">{mentor.business_name}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{mentor.rating}</span>
              <span className="text-sm text-gray-500">({mentor.total_mentees} mentees)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-3">{mentor.bio}</p>
        
        {/* Industries */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">INDUSTRIES</p>
          <div className="flex flex-wrap gap-1">
            {mentor.industries.slice(0, 2).map(industry => (
              <Badge key={industry} variant="secondary" className="text-xs">
                {industry}
              </Badge>
            ))}
            {mentor.industries.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{mentor.industries.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Expertise */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">EXPERTISE</p>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise_areas.slice(0, 3).map(area => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
            {mentor.expertise_areas.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise_areas.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-medium">{mentor.years_experience}</p>
            <p className="text-xs text-gray-500">Years Exp.</p>
          </div>
          <div>
            <p className="text-sm font-medium">{availableSlots}</p>
            <p className="text-xs text-gray-500">Available</p>
          </div>
          <div>
            <p className="text-sm font-medium">{mentor.current_mentees}</p>
            <p className="text-xs text-gray-500">Current</p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{mentor.availability_hours}</span>
        </div>

        {/* Communication preferences */}
        <div className="flex flex-wrap gap-1">
          {mentor.preferred_communication.map(method => (
            <Badge key={method} variant="outline" className="text-xs">
              {method}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleConnect}
            className="flex-1 bg-mansablue hover:bg-mansablue-dark"
            disabled={availableSlots === 0}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {availableSlots > 0 ? 'Connect' : 'Fully Booked'}
          </Button>
          <Button variant="outline" onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorCard;
