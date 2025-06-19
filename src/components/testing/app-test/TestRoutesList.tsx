
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { RouteTest } from './types';

interface TestRoutesListProps {
  tests: RouteTest[];
}

export const TestRoutesList: React.FC<TestRoutesListProps> = ({ tests }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: RouteTest['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: RouteTest['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const navigateToRoute = (path: string) => {
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All App Pages</CardTitle>
        <CardDescription>Click any page name to navigate there directly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3 flex-grow">
                {getStatusIcon(test.status)}
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToRoute(test.path)}
                      className="font-medium text-mansablue hover:underline text-left"
                    >
                      {test.name}
                    </button>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                    {test.requiresAuth && (
                      <Badge variant="outline" className="text-xs">Auth Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{test.message}</p>
                  <p className="text-xs text-gray-400">{test.path}</p>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
