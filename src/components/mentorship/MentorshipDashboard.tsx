
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageCircle, Clock, Star, Users, TrendingUp } from 'lucide-react';
import { MentorshipMatch } from '@/types/mentorship';

const MentorshipDashboard = () => {
  const [activeMatches, setActiveMatches] = useState<MentorshipMatch[]>([]);

  // Mock data for demonstration
  const mockMatches: MentorshipMatch[] = [
    {
      id: '1',
      mentor_id: 'mentor1',
      mentee_id: 'mentee1',
      match_status: 'active',
      match_score: 95,
      start_date: '2024-01-15',
      goals_set: ['Develop marketing strategy', 'Improve financial planning'],
      progress_notes: 'Great progress on marketing plan. Next: focus on digital channels.',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      mentor_name: 'Sarah Johnson',
      mentee_name: 'Alex Chen',
      mentor_business: 'TechFlow Solutions'
    },
    {
      id: '2',
      mentor_id: 'mentor2',
      mentee_id: 'mentee2',
      match_status: 'active',
      match_score: 88,
      start_date: '2024-02-01',
      goals_set: ['Scale operations', 'Build team'],
      progress_notes: 'Working on operational efficiency and hiring strategy.',
      created_at: '2024-02-01',
      updated_at: '2024-02-01',
      mentor_name: 'Marcus Williams',
      mentee_name: 'Taylor Rodriguez',
      mentor_business: 'Williams Restaurant Group'
    }
  ];

  const stats = {
    active_mentorships: 2,
    total_sessions: 8,
    hours_mentored: 16,
    average_rating: 4.8
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-mansablue" />
              <div>
                <p className="text-2xl font-bold">{stats.active_mentorships}</p>
                <p className="text-sm text-gray-600">Active Mentorships</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total_sessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.hours_mentored}</p>
                <p className="text-sm text-gray-600">Hours Mentored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.average_rating}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Mentorships</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockMatches.map(match => (
            <Card key={match.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {match.mentee_name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{match.mentee_name}</h3>
                      <p className="text-sm text-gray-600">
                        Mentorship started {new Date(match.start_date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          Match Score: {match.match_score}%
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {match.match_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Current Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.goals_set.map(goal => (
                      <Badge key={goal} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {match.progress_notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Latest Progress:</h4>
                    <p className="text-sm text-gray-700">{match.progress_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">New mentorship requests will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No completed mentorships yet</h3>
              <p className="text-gray-600">Completed mentorships will show here with success metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No upcoming sessions</h3>
              <p className="text-gray-600">
                Schedule your next mentorship session to see it here.
              </p>
              <Button className="mt-4 bg-mansablue hover:bg-mansablue-dark">
                Schedule Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipDashboard;
