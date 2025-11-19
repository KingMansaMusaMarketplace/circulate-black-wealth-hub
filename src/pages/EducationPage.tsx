import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, DollarSign, Users, Target, Award, PlayCircle, FileText, ChevronRight } from 'lucide-react';

const EducationPage: React.FC = () => {
  const courses = [
    {
      title: 'Business Fundamentals',
      description: 'Learn the basics of starting and running a successful business',
      icon: <BookOpen className="h-6 w-6" />,
      lessons: 12,
      duration: '4 weeks',
      level: 'Beginner',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Financial Literacy',
      description: 'Master personal and business finance management',
      icon: <DollarSign className="h-6 w-6" />,
      lessons: 10,
      duration: '3 weeks',
      level: 'Beginner',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Digital Marketing',
      description: 'Grow your business with effective online marketing strategies',
      icon: <TrendingUp className="h-6 w-6" />,
      lessons: 15,
      duration: '5 weeks',
      level: 'Intermediate',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Customer Success',
      description: 'Build lasting relationships and create loyal customers',
      icon: <Users className="h-6 w-6" />,
      lessons: 8,
      duration: '2 weeks',
      level: 'Beginner',
      color: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Business Strategy',
      description: 'Develop winning strategies for long-term growth',
      icon: <Target className="h-6 w-6" />,
      lessons: 14,
      duration: '4 weeks',
      level: 'Advanced',
      color: 'from-red-500 to-red-700'
    },
    {
      title: 'Leadership & Management',
      description: 'Lead your team and manage operations effectively',
      icon: <Award className="h-6 w-6" />,
      lessons: 11,
      duration: '3 weeks',
      level: 'Intermediate',
      color: 'from-yellow-500 to-yellow-700'
    }
  ];

  const resources = [
    { title: 'Business Plan Templates', icon: <FileText className="h-5 w-5" />, count: '25+' },
    { title: 'Video Tutorials', icon: <PlayCircle className="h-5 w-5" />, count: '100+' },
    { title: 'Industry Guides', icon: <BookOpen className="h-5 w-5" />, count: '50+' },
    { title: 'Expert Webinars', icon: <Users className="h-5 w-5" />, count: '30+' }
  ];

  return (
    <ResponsiveLayout
      title="Education Center"
      description="Learn, grow, and succeed with our comprehensive business education resources"
      useSubtleBackground={false}
    >
      <Helmet>
        <title>Education Center | Mansa Musa Marketplace</title>
        <meta name="description" content="Access free business education courses, resources, and training to grow your business" />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 px-4 py-2 text-sm">
              Free Educational Resources
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-white">Empower Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mansagold via-yellow-400 to-mansagold">
              Business Journey
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Access comprehensive courses, expert resources, and practical tools designed to help Black-owned businesses thrive and grow.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {resources.map((resource, index) => (
            <Card key={index} className="border border-white/10 bg-slate-800/60 backdrop-blur-xl hover:bg-slate-800/80 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3 text-mansagold">
                  {resource.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{resource.count}</div>
                <div className="text-sm text-slate-300">{resource.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mansagold to-yellow-400">
              Featured Courses
            </h2>
            <Button variant="outline" className="border-white/20 text-white hover:bg-slate-800/60 hover:text-mansagold">
              View All Courses
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card 
                key={index} 
                className="border border-white/10 bg-slate-800/60 backdrop-blur-xl hover:bg-slate-800/80 hover:border-mansagold/40 transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                  </div>
                  <CardTitle className="text-white group-hover:text-mansagold transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-slate-400 mt-2">
                    {course.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-slate-700/60 text-slate-300 border-white/10">
                      {course.level}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-mansagold hover:text-yellow-400 hover:bg-mansagold/10"
                    >
                      Start Learning
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-800/60 backdrop-blur-xl animate-fade-in">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of entrepreneurs building successful businesses with our free educational resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-blue-700 hover:to-mansablue text-white shadow-lg"
              >
                Browse All Courses
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-slate-800/60 hover:text-mansagold"
              >
                Download Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default EducationPage;
