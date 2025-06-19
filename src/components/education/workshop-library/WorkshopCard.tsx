
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Star, Play, Download } from 'lucide-react';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  rating: number;
  price: number;
  isLive: boolean;
  hasRecording: boolean;
  tags: string[];
}

interface WorkshopCardProps {
  workshop: Workshop;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge 
            variant={workshop.isLive ? "default" : "secondary"}
            className={workshop.isLive ? "bg-green-500" : ""}
          >
            {workshop.isLive ? "Live" : "Recorded"}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{workshop.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{workshop.title}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{workshop.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{workshop.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{workshop.date} at {workshop.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{workshop.attendees}/{workshop.maxAttendees} attendees</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {workshop.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-bold text-mansablue">
            ${workshop.price}
          </div>
          <div className="flex gap-2">
            {workshop.hasRecording && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Recording
              </Button>
            )}
            <Button size="sm" className="bg-mansablue hover:bg-mansablue-dark">
              <Play className="h-4 w-4 mr-1" />
              {workshop.isLive ? 'Join Live' : 'Watch Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
