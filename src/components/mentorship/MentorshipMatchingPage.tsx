
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Clock, MapPin, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MentorProfile, MenteeApplication } from '@/types/mentorship';
import MentorCard from './MentorCard';
import MenteeApplicationForm from './MenteeApplicationForm';
import MentorApplicationForm from './MentorApplicationForm';
import MentorshipDashboard from './MentorshipDashboard';

const MentorshipMatchingPage = () => {
  const { user, userType } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockMentors: MentorProfile[] = [
    {
      id: '1',
      user_id: 'user1',
      business_id: 'biz1',
      expertise_areas: ['Marketing', 'Digital Strategy', 'Brand Building'],
      industries: ['Technology', 'E-commerce'],
      years_experience: 8,
      mentoring_capacity: 3,
      current_mentees: 2,
      bio: 'Successful entrepreneur with 8 years of experience building tech startups. Specialized in digital marketing and scaling online businesses.',
      availability_hours: 'Evenings and weekends',
      preferred_communication: ['Video Call', 'Phone', 'Email'],
      is_active: true,
      rating: 4.8,
      total_mentees: 15,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user_name: 'Sarah Johnson',
      business_name: 'TechFlow Solutions',
      profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      user_id: 'user2',
      business_id: 'biz2',
      expertise_areas: ['Financial Planning', 'Business Operations', 'Scaling'],
      industries: ['Retail', 'Food & Beverage'],
      years_experience: 12,
      mentoring_capacity: 2,
      current_mentees: 1,
      bio: 'Restaurant owner and retail consultant with over 12 years of experience. Expert in financial planning and operational efficiency.',
      availability_hours: 'Mornings and early afternoons',
      preferred_communication: ['In-Person', 'Video Call'],
      is_active: true,
      rating: 4.9,
      total_mentees: 23,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user_name: 'Marcus Williams',
      business_name: 'Williams Restaurant Group',
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      user_id: 'user3',
      business_id: 'biz3',
      expertise_areas: ['Product Development', 'Manufacturing', 'Supply Chain'],
      industries: ['Beauty & Wellness', 'Consumer Products'],
      years_experience: 6,
      mentoring_capacity: 4,
      current_mentees: 2,
      bio: 'Beauty entrepreneur who built a successful skincare line from scratch. Passionate about helping others navigate product development.',
      availability_hours: 'Flexible schedule',
      preferred_communication: ['Video Call', 'Email', 'Text'],
      is_active: true,
      rating: 4.7,
      total_mentees: 8,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user_name: 'Nia Davis',
      business_name: 'Pure Glow Skincare',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const industries = [
    'Technology', 'E-commerce', 'Retail', 'Food & Beverage', 
    'Beauty & Wellness', 'Healthcare', 'Financial Services', 
    'Real Estate', 'Education', 'Construction', 'Other'
  ];

  const expertiseAreas = [
    'Marketing', 'Financial Planning', 'Operations', 'Product Development',
    'Digital Strategy', 'Sales', 'Human Resources', 'Legal', 'Scaling',
    'Brand Building', 'Customer Service', 'Supply Chain'
  ];

  useEffect(() => {
    setMentors(mockMentors);
  }, []);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || 
                           mentor.industries.includes(selectedIndustry);
    
    const matchesExpertise = selectedExpertise === 'all' || 
                            mentor.expertise_areas.includes(selectedExpertise);
    
    return matchesSearch && matchesIndustry && matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Network</h1>
          <p className="text-gray-600 mt-2">
            Connect with experienced business owners and accelerate your entrepreneurial journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
            <TabsTrigger value="apply-mentee">Apply as Mentee</TabsTrigger>
            <TabsTrigger value="apply-mentor">Become a Mentor</TabsTrigger>
            <TabsTrigger value="dashboard">My Mentorships</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search mentors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mansablue"
                  >
                    <option value="all">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  <select
                    value={selectedExpertise}
                    onChange={(e) => setSelectedExpertise(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mansablue"
                  >
                    <option value="all">All Expertise</option>
                    {expertiseAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="apply-mentee" className="mt-6">
            <MenteeApplicationForm />
          </TabsContent>

          <TabsContent value="apply-mentor" className="mt-6">
            <MentorApplicationForm />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <MentorshipDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipMatchingPage;
