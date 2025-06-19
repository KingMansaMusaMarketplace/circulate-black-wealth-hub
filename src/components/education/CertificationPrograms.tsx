
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Clock, Users, CheckCircle, Star, Calendar, Trophy, BookOpen } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  modules: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  enrolled: number;
  rating: number;
  benefits: string[];
  requirements: string[];
  isPopular: boolean;
  isAccredited: boolean;
  nextStartDate: string;
  progress?: number;
  completed?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: React.ReactNode;
  category: string;
}

const CertificationPrograms = () => {
  const [activeTab, setActiveTab] = useState('available');

  const certifications: Certification[] = [
    {
      id: '1',
      title: 'Certified Black Business Entrepreneur (CBBE)',
      description: 'Comprehensive certification covering all aspects of starting and running a successful Black-owned business.',
      provider: 'Mansa Musa Institute',
      duration: '12 weeks',
      modules: 15,
      level: 'Intermediate',
      price: 497,
      enrolled: 1247,
      rating: 4.8,
      benefits: [
        'Official CBBE Certificate',
        'Alumni Network Access',
        'Ongoing Mentorship',
        'Resource Library Access',
        'Priority Business Funding Opportunities'
      ],
      requirements: [
        'Basic business knowledge',
        '10+ hours per week commitment',
        'Computer with internet access'
      ],
      isPopular: true,
      isAccredited: true,
      nextStartDate: '2024-08-01',
      progress: 65,
      completed: false
    },
    {
      id: '2',
      title: 'Digital Marketing Specialist for Black Businesses',
      description: 'Master digital marketing strategies specifically designed for Black-owned businesses and community engagement.',
      provider: 'Digital Empowerment Academy',
      duration: '8 weeks',
      modules: 12,
      level: 'Beginner',
      price: 297,
      enrolled: 892,
      rating: 4.9,
      benefits: [
        'Digital Marketing Certificate',
        'Portfolio Development',
        'Industry Tools Access',
        'Job Placement Assistance'
      ],
      requirements: [
        'No prior experience required',
        '8+ hours per week commitment',
        'Social media familiarity helpful'
      ],
      isPopular: true,
      isAccredited: false,
      nextStartDate: '2024-07-15'
    },
    {
      id: '3',
      title: 'Financial Literacy for Black Wealth Building',
      description: 'Advanced financial planning and wealth building strategies for Black individuals and families.',
      provider: 'Wealth Academy',
      duration: '6 weeks',
      modules: 8,
      level: 'Advanced',
      price: 397,
      enrolled: 543,
      rating: 4.7,
      benefits: [
        'Financial Planning Certificate',
        'Personal Finance Tools',
        'One-on-One Coaching Session',
        'Investment Group Access'
      ],
      requirements: [
        'Basic financial knowledge',
        'Income tracking for 3 months',
        '6+ hours per week commitment'
      ],
      isPopular: false,
      isAccredited: true,
      nextStartDate: '2024-07-22',
      progress: 100,
      completed: true
    },
    {
      id: '4',
      title: 'Community Leadership and Social Impact',
      description: 'Develop leadership skills to create positive change in Black communities through business and advocacy.',
      provider: 'Leadership Institute',
      duration: '10 weeks',
      modules: 10,
      level: 'Advanced',
      price: 447,
      enrolled: 321,
      rating: 4.6,
      benefits: [
        'Leadership Certificate',
        'Community Project Funding',
        'Speaking Opportunities',
        'Media Training Session'
      ],
      requirements: [
        'Leadership experience preferred',
        'Community involvement',
        '12+ hours per week commitment'
      ],
      isPopular: false,
      isAccredited: true,
      nextStartDate: '2024-08-15'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Financial Literacy Master',
      description: 'Completed the Financial Literacy for Black Wealth Building certification',
      earnedDate: '2024-06-15',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      category: 'Certification'
    },
    {
      id: '2',
      title: 'Community Builder',
      description: 'Attended 5 community workshops and events',
      earnedDate: '2024-06-01',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      category: 'Engagement'
    },
    {
      id: '3',
      title: 'Knowledge Sharer',
      description: 'Completed 10 educational modules',
      earnedDate: '2024-05-20',
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      category: 'Learning'
    }
  ];

  const enrolledCertifications = certifications.filter(cert => cert.progress !== undefined);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Programs</TabsTrigger>
          <TabsTrigger value="enrolled">My Certifications</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6 mt-6">
          {/* Popular Certifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Popular Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.filter(cert => cert.isPopular).map(cert => (
                <Card key={cert.id} className="group hover:shadow-lg transition-shadow border-l-4 border-l-mansablue">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-mansablue" />
                        {cert.isAccredited && (
                          <Badge className="bg-green-500">Accredited</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{cert.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{cert.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{cert.enrolled} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{cert.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Starts {cert.nextStartDate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Key Benefits:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {cert.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-2xl font-bold text-mansablue">
                        ${cert.price}
                      </div>
                      <Button className="bg-mansablue hover:bg-mansablue-dark">
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Certifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">All Certification Programs</h3>
            <div className="grid grid-cols-1 gap-4">
              {certifications.map(cert => (
                <Card key={cert.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{cert.title}</h4>
                          <Badge variant="outline">{cert.level}</Badge>
                          {cert.isAccredited && (
                            <Badge className="bg-green-500">Accredited</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{cert.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>{cert.provider}</span>
                          <span>{cert.duration}</span>
                          <span>{cert.modules} modules</span>
                          <span>★ {cert.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-mansablue mb-2">
                          ${cert.price}
                        </div>
                        <Button className="bg-mansablue hover:bg-mansablue-dark">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-6 mt-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-mansablue" />
                Your Certification Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mansablue">{enrolledCertifications.length}</div>
                  <p className="text-sm text-gray-600">Enrolled Programs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {enrolledCertifications.filter(cert => cert.completed).length}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {enrolledCertifications.filter(cert => !cert.completed).length}
                  </div>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCertifications.map(cert => (
              <Card key={cert.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-mansablue" />
                      {cert.completed ? (
                        <Badge className="bg-green-500">Completed</Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{cert.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <p className="text-sm text-gray-600">{cert.provider}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{cert.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{cert.modules} modules</span>
                    </div>
                  </div>

                  <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                    {cert.completed ? 'View Certificate' : 'Continue Learning'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <Card key={achievement.id} className="group hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {achievement.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{achievement.category}</Badge>
                    <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificationPrograms;
