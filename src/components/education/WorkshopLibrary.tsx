
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Star, Search, Play, Download } from 'lucide-react';

interface Workshop {
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

const WorkshopLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const workshops: Workshop[] = [
    {
      id: '1',
      title: 'Building Your First Black-Owned Business',
      description: 'Learn the fundamentals of starting and scaling a successful Black-owned business, from ideation to execution.',
      instructor: 'Dr. Marcus Johnson',
      duration: '2 hours',
      level: 'Beginner',
      category: 'Business Fundamentals',
      date: '2024-07-01',
      time: '6:00 PM EST',
      attendees: 45,
      maxAttendees: 50,
      rating: 4.8,
      price: 29,
      isLive: true,
      hasRecording: true,
      tags: ['startup', 'business plan', 'funding']
    },
    {
      id: '2',
      title: 'Digital Marketing for Black Entrepreneurs',
      description: 'Master social media marketing, content creation, and online advertising specifically for Black-owned businesses.',
      instructor: 'Kenya Washington',
      duration: '1.5 hours',
      level: 'Intermediate',
      category: 'Marketing & Sales',
      date: '2024-07-03',
      time: '7:00 PM EST',
      attendees: 38,
      maxAttendees: 40,
      rating: 4.9,
      price: 39,
      isLive: false,
      hasRecording: true,
      tags: ['social media', 'branding', 'digital marketing']
    },
    {
      id: '3',
      title: 'Accessing Capital: Grants and Funding for Black Businesses',
      description: 'Navigate the funding landscape with focus on grants, loans, and investment opportunities for minority businesses.',
      instructor: 'Robert Davis',
      duration: '2.5 hours',
      level: 'Advanced',
      category: 'Finance & Funding',
      date: '2024-07-05',
      time: '5:30 PM EST',
      attendees: 32,
      maxAttendees: 35,
      rating: 4.7,
      price: 49,
      isLive: true,
      hasRecording: false,
      tags: ['funding', 'grants', 'investment', 'sba loans']
    },
    {
      id: '4',
      title: 'Building Generational Wealth Through Business',
      description: 'Learn strategies for creating lasting wealth that can be passed down through generations.',
      instructor: 'Dr. Angela Smith',
      duration: '3 hours',
      level: 'Advanced',
      category: 'Wealth Building',
      date: '2024-07-08',
      time: '6:00 PM EST',
      attendees: 28,
      maxAttendees: 30,
      rating: 4.9,
      price: 59,
      isLive: true,
      hasRecording: true,
      tags: ['wealth building', 'estate planning', 'succession']
    },
    {
      id: '5',
      title: 'Community-Centered Business Models',
      description: 'Explore how to build businesses that serve and strengthen Black communities while generating profit.',
      instructor: 'Michael Thompson',
      duration: '2 hours',
      level: 'Intermediate',
      category: 'Social Impact',
      date: '2024-07-10',
      time: '7:30 PM EST',
      attendees: 41,
      maxAttendees: 45,
      rating: 4.6,
      price: 35,
      isLive: false,
      hasRecording: true,
      tags: ['community impact', 'social enterprise', 'purpose-driven']
    }
  ];

  const categories = ['all', 'Business Fundamentals', 'Marketing & Sales', 'Finance & Funding', 'Wealth Building', 'Social Impact'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Workshop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map(workshop => (
          <Card key={workshop.id} className="group hover:shadow-lg transition-shadow">
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
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workshops found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkshopLibrary;
