
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Database, Smartphone, Users } from 'lucide-react';
import { TestResult } from './types';

interface TestResultsSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tests: TestResult[];
}

const TestResultsSection: React.FC<TestResultsSectionProps> = ({ title, icon: Icon, tests }) => {
  const getStatusIcon = (status: TestResult['status']) => {
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

  const getStatusBadge = (status: TestResult['status']) => {
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

  if (tests.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <span className="font-medium">{test.name}</span>
                  <p className="text-sm text-gray-600">{test.message}</p>
                  {test.details && (
                    <p className="text-xs text-gray-500 mt-1">{test.details}</p>
                  )}
                  {test.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {test.error.message || String(test.error)}
                    </p>
                  )}
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

interface TestResultsSectionsProps {
  tests: TestResult[];
}

export const TestResultsSections: React.FC<TestResultsSectionsProps> = ({ tests }) => {
  const criticalTests = tests.filter(t => t.category === 'critical');
  const importantTests = tests.filter(t => t.category === 'important');
  const optionalTests = tests.filter(t => t.category === 'optional');

  return (
    <>
      <TestResultsSection
        title="Critical Systems (Must Pass for Mobile)"
        icon={Database}
        tests={criticalTests}
      />
      <TestResultsSection
        title="Mobile Features"
        icon={Smartphone}
        tests={importantTests}
      />
      <TestResultsSection
        title="Device Features"
        icon={Users}
        tests={optionalTests}
      />
    </>
  );
};
