
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'calculator' | 'template' | 'checklist';
  description: string;
  downloadUrl: string;
  icon: React.ReactNode;
}

interface ResourceCardProps {
  resource: Resource;
  getResourceTypeColor: (type: string) => string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, getResourceTypeColor }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
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
  );
};

export default ResourceCard;
