
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, FileText, CheckCircle, BookOpen } from 'lucide-react';
import CourseCard from './financial-literacy/CourseCard';
import ResourceCard from './financial-literacy/ResourceCard';
import { courses, resources } from './financial-literacy/financialData';

const FinancialLiteracyCenter = () => {
  const [activeTab, setActiveTab] = useState('courses');

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
              <CourseCard key={course.id} course={course} />
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
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                getResourceTypeColor={getResourceTypeColor}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialLiteracyCenter;
