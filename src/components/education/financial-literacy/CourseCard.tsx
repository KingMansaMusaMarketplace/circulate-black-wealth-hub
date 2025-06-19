
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play } from 'lucide-react';

export interface Course {
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

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
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
  );
};

export default CourseCard;
