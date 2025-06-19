
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, DollarSign, TrendingUp, PiggyBank, CreditCard, Home, Briefcase, CheckCircle, Play, FileText } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  level: string;
  progress: number;
  enrolled: boolean;
  icon: React.ReactNode;
  color: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'calculator' | 'template' | 'checklist';
  description: string;
  downloadUrl: string;
  icon: React.ReactNode;
}

const FinancialLiteracyCenter = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Building Credit and Managing Debt',
      description: 'Learn strategies for building excellent credit and managing debt effectively for business and personal growth.',
      modules: 6,
      duration: '4 hours',
      level: 'Beginner',
      progress: 75,
      enrolled: true,
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Investment Fundamentals for Black Wealth Building',
      description: 'Master the basics of investing with focus on building long-term wealth in the Black community.',
      modules: 8,
      duration: '6 hours',
      level: 'Intermediate',
      progress: 25,
      enrolled: true,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Business Financial Management',
      description: 'Essential financial skills for Black entrepreneurs including cash flow, budgeting, and financial planning.',
      modules: 10,
      duration: '8 hours',
      level: 'Advanced',
      progress: 0,
      enrolled: false,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'Real Estate Investment for Beginners',
      description: 'Learn how to build wealth through real estate investment in Black communities.',
      modules: 7,
      duration: '5 hours',
      level: 'Beginner',
      progress: 0,
      enrolled: false,
      icon: <Home className="h-6 w-6" />,
      color: 'bg-orange-500'
    },
    {
      id: '5',
      title: 'Emergency Fund and Savings Strategies',
      description: 'Build financial security with proven savings strategies and emergency fund planning.',
      modules: 4,
      duration: '3 hours',
      level: 'Beginner',
      progress: 100,
      enrolled: true,
      icon: <PiggyBank className="h-6 w-6" />,
      color: 'bg-pink-500'
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Personal Budget Calculator',
      type: 'calculator',
      description: 'Interactive tool to create and manage your monthly budget with Black wealth-building focus.',
      downloadUrl: '/resources/budget-calculator',
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Business Financial Plan Template',
      type: 'template',
      description: 'Comprehensive template for creating a financial plan for your Black-owned business.',
      downloadUrl: '/resources/business-financial-plan',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Credit Score Improvement Checklist',
      type: 'checklist',
      description: 'Step-by-step checklist to improve your credit score and access better financing.',
      downloadUrl: '/resources/credit-improvement-checklist',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Investment Portfolio Diversification Guide',
      type: 'article',
      description: 'Learn how to diversify your investment portfolio with focus on Black-owned assets.',
      downloadUrl: '/resources/investment-diversification',
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'calculator': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'checklist': return 'bg-orange-100 text-orange-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6 mt-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-mansablue" />
                Your Financial Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mansablue">3</div>
                  <p className="text-sm text-gray-600">Courses Enrolled</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">67%</div>
                  <p className="text-sm text-gray-600">Average Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${course.color} text-white`}>
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600">{course.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.modules} modules</span>
                    <span>{course.duration}</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>

                  {course.enrolled && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <Button 
                    className={`w-full ${course.enrolled ? 'bg-mansablue hover:bg-mansablue-dark' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6 mt-6">
          {/* Resource Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['calculator', 'template', 'checklist', 'article'].map(type => {
              const count = resources.filter(r => r.type === type).length;
              return (
                <Card key={type} className="text-center p-4">
                  <div className={`inline-flex p-3 rounded-lg ${getResourceTypeColor(type)} mb-2`}>
                    {type === 'calculator' && <DollarSign className="h-6 w-6" />}
                    {type === 'template' && <FileText className="h-6 w-6" />}
                    {type === 'checklist' && <CheckCircle className="h-6 w-6" />}
                    {type === 'article' && <BookOpen className="h-6 w-6" />}
                  </div>
                  <div className="font-semibold capitalize">{type}s</div>
                  <div className="text-sm text-gray-600">{count} available</div>
                </Card>
              );
            })}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map(resource => (
              <Card key={resource.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getResourceTypeColor(resource.type)}`}>
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                    {resource.type === 'calculator' ? 'Use Calculator' : 'Download'}
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

export default FinancialLiteracyCenter;
