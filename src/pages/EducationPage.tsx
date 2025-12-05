import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, DollarSign, Users, Target, Award, PlayCircle, FileText, ChevronRight, Construction, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const EducationPage: React.FC = () => {
  console.log('[EDUCATION PAGE] Loading with Coming Soon overlay - 2025-12-05');
  
  // Dark theme education page with animated gradient orbs
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Helmet>
        <title>Education Center | Mansa Musa Marketplace</title>
        <meta name="description" content="Access free business education courses, resources, and training to grow your business" />
      </Helmet>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
        <div className="text-center space-y-8 p-8 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4">
            <Construction className="h-12 w-12 text-slate-900" />
          </div>
          
          <div className="space-y-4">
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-4 py-2 text-sm">
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Education Center
            </h1>
            <p className="text-xl text-blue-200 max-w-xl mx-auto">
              We're building something amazing! Our comprehensive education platform with courses, resources, and expert content is currently under development.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 flex items-center justify-center gap-2">
              <Bell className="h-5 w-5" />
              What's Coming
            </h3>
            <ul className="text-blue-200 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Business Fundamentals & Financial Literacy Courses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Digital Marketing & Customer Success Training
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Expert Webinars & Video Tutorials
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Downloadable Templates & Industry Guides
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-lg"
              >
                Return Home
              </Button>
            </Link>
            <Link to="/directory">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
              >
                Explore Businesses
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-12 py-8 px-4">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-4 py-2 text-sm">
              Free Educational Resources
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-white">Empower Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400">
              Business Journey
            </span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Access comprehensive courses, expert resources, and practical tools designed to help Black-owned businesses thrive and grow.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {resources.map((resource, index) => (
            <Card key={index} className="border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3 text-yellow-400">
                  {resource.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{resource.count}</div>
                <div className="text-sm text-blue-200">{resource.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400">
              Featured Courses
            </h2>
            <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900">
              View All Courses
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card 
                key={index} 
                className="border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                  </div>
                  <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-blue-200 mt-2">
                    {course.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-blue-200">
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
                    <Badge className="bg-slate-800/60 text-blue-200 border-white/10">
                      {course.level}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
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
        <Card className="border border-white/10 bg-slate-900/40 backdrop-blur-xl animate-fade-in">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Join thousands of entrepreneurs building successful businesses with our free educational resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-lg"
              >
                Browse All Courses
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
              >
                Download Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationPage;
