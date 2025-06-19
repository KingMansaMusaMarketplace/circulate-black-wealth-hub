
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface DeploymentStatusProps {
  criticalFailCount: number;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ criticalFailCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Mobile Deployment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalFailCount === 0 ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✅ Ready for Mobile Deployment!</strong>
              <br />
              All critical systems are working correctly. The app is ready to be deployed to mobile devices.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>❌ Mobile Deployment Blocked</strong>
              <br />
              {criticalFailCount} critical test{criticalFailCount > 1 ? 's' : ''} failed. Please fix these issues before deploying to mobile.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📱 Next Steps for Mobile Deployment:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Export project to GitHub repository</li>
            <li>2. Clone repository locally: <code className="bg-blue-100 px-1 rounded">git clone [repo-url]</code></li>
            <li>3. Install dependencies: <code className="bg-blue-100 px-1 rounded">npm install</code></li>
            <li>4. Add mobile platforms: <code className="bg-blue-100 px-1 rounded">npx cap add ios android</code></li>
            <li>5. Build project: <code className="bg-blue-100 px-1 rounded">npm run build</code></li>
            <li>6. Sync to mobile: <code className="bg-blue-100 px-1 rounded">npx cap sync</code></li>
            <li>7. Run on device: <code className="bg-blue-100 px-1 rounded">npx cap run ios/android</code></li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
