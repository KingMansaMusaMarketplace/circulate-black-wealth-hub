
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Video, BookOpen, Search, ExternalLink, Users, Calendar } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'webinar' | 'case-study' | 'tool';
  category: string;
  downloadUrl: string;
  isPopular: boolean;
  isNew: boolean;
  downloads: number;
  rating: number;
  icon: React.ReactNode;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  presenter: string;
  date: string;
  duration: string;
  isUpcoming: boolean;
  attendees: number;
  topics: string[];
}

const BusinessResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Business Plan Template for Black Entrepreneurs',
      description: 'Comprehensive business plan template with sections specifically for minority-owned businesses.',
      type: 'template',
      category: 'Business Planning',
      downloadUrl: '/resources/business-plan-template',
      isPopular: true,
      isNew: false,
      downloads: 1247,
      rating: 4.8,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Marketing Strategy Guide for Black-Owned Businesses',
      description: 'Complete guide to marketing your business within Black communities and beyond.',
      type: 'guide',
      category: 'Marketing',
      downloadUrl: '/resources/marketing-guide',
      isPopular: true,
      isNew: true,
      downloads: 892,
      rating: 4.9,
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Legal Compliance Checklist',
      description: 'Essential legal requirements checklist for starting and operating a Black-owned business.',
      type: 'template',
      category: 'Legal & Compliance',
      downloadUrl: '/resources/legal-checklist',
      isPopular: false,
      isNew: true,
      downloads: 543,
      rating: 4.7,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Financial Projection Calculator',
      description: 'Interactive tool for creating financial projections and cash flow analysis.',
      type: 'tool',
      category: 'Finance',
      downloadUrl: '/resources/financial-calculator',
      isPopular: true,
      isNew: false,
      downloads: 1156,
      rating: 4.6,
      icon: <ExternalLink className="h-5 w-5" />
    },
    {
      id: '5',
      title: 'Success Story: From Idea to Million-Dollar Business',
      description: 'Case study of a Black entrepreneur who built a million-dollar business from scratch.',
      type: 'case-study',
      category: 'Success Stories',
      downloadUrl: '/resources/success-story-1',
      isPopular: false,
      isNew: false,
      downloads: 689,
      rating: 4.8,
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  const webinars: Webinar[] = [
    {
      id: '1',
      title: 'Scaling Your Black-Owned Business in 2024',
      description: 'Learn proven strategies for scaling your business while maintaining your values and community focus.',
      presenter: 'Dr. Kimberly Williams',
      date: '2024-07-15',
      duration: '60 minutes',
      isUpcoming: true,
      attendees: 234,
      topics: ['scaling', 'growth strategies', 'team building']
    },
    {
      id: '2',
      title: 'Digital Transformation for Traditional Black Businesses',
      description: 'How to modernize your business operations and reach new customers through digital channels.',
      presenter: 'Marcus Technology Solutions',
      date: '2024-07-08',
      duration: '45 minutes',
      isUpcoming: false,
      attendees: 189,
      topics: ['digital transformation', 'e-commerce', 'technology']
    },
    {
      id: '3',
      title: 'Building Strategic Partnerships in the Black Business Community',
      description: 'Discover how to form meaningful partnerships that benefit both businesses and the community.',
      presenter: 'Angela Roberts',
      date: '2024-07-22',
      duration: '75 minutes',
      isUpcoming: true,
      attendees: 156,
      topics: ['partnerships', 'networking', 'collaboration']
    }
  ];

  const categories = ['all', 'Business Planning', 'Marketing', 'Finance', 'Legal & Compliance', 'Success Stories'];
  const types = ['all', 'template', 'guide', 'webinar', 'case-study', 'tool'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="resources">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources">Resource Library</TabsTrigger>
          <TabsTrigger value="webinars">Webinars & Events</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6 mt-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Popular Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => r.isPopular).map(resource => (
                <Card key={resource.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-mansablue/10 rounded-lg">
                          {resource.icon}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      {resource.isNew && (
                        <Badge className="bg-green-500">New</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{resource.downloads} downloads</span>
                      <span>★ {resource.rating}</span>
                    </div>
                    <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4">All Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-mansablue/10 rounded-lg">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{resource.title}</h4>
                          {resource.isNew && <Badge className="bg-green-500">New</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{resource.downloads} downloads</span>
                            <span>★ {resource.rating}</span>
                          </div>
                          <Button size="sm" className="bg-mansablue hover:bg-mansablue-dark">
                            <Download className="h-3 w-3 mr-1" />
                            Get
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map(webinar => (
              <Card key={webinar.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={webinar.isUpcoming ? "default" : "secondary"}>
                      {webinar.isUpcoming ? "Upcoming" : "Recorded"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {webinar.attendees}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{webinar.title}</CardTitle>
                  <p className="text-sm text-gray-600">{webinar.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{webinar.presenter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>{webinar.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {webinar.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                    {webinar.isUpcoming ? 'Register' : 'Watch Recording'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessResourceHub;
