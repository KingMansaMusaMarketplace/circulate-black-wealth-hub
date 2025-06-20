import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees?: number;
  organizer: string;
  isVirtual: boolean;
  isFeatured: boolean;
  tags: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Black Business Networking Mixer',
    description: 'Connect with fellow entrepreneurs and business owners in our community.',
    date: '2024-03-15',
    time: '6:00 PM',
    location: 'Community Center Downtown',
    category: 'Networking',
    attendees: 45,
    maxAttendees: 100,
    organizer: 'Mansa Musa Marketplace',
    isVirtual: false,
    isFeatured: true,
    tags: ['networking', 'business', 'community']
  },
  {
    id: '2',
    title: 'Financial Literacy Workshop',
    description: 'Learn how to manage your finances and grow your wealth.',
    date: '2024-04-01',
    time: '10:00 AM',
    location: 'Online Webinar',
    category: 'Education',
    attendees: 120,
    maxAttendees: 200,
    organizer: 'Financial Freedom Group',
    isVirtual: true,
    isFeatured: false,
    tags: ['finance', 'education', 'wealth']
  },
  {
    id: '3',
    title: 'Community Cleanup Day',
    description: 'Join us in cleaning up our neighborhood and making it a better place.',
    date: '2024-04-15',
    time: '9:00 AM',
    location: 'Local Park',
    category: 'Community Service',
    attendees: 60,
    organizer: 'Neighborhood Association',
    isVirtual: false,
    isFeatured: false,
    tags: ['community', 'service', 'cleanup']
  },
];

const CommunityEvents: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Events</h2>
        <Button>Create Event</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={event.isFeatured ? 'default' : 'secondary'}>
                  {event.category}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.attendees} attending
                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  Join Event
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityEvents;
