
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Smartphone, Settings } from 'lucide-react';

export const MobileReadiness: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-yellow-400" />
            Mobile Deployment Readiness
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <h3 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ready for Mobile Deployment
              </h3>
              <ul className="text-sm text-green-300/80 space-y-1">
                <li>• Capacitor configuration is properly set up</li>
                <li>• Database connections are working</li>
                <li>• Authentication system is functional</li>
                <li>• Responsive design is implemented</li>
                <li>• Touch interface support is ready</li>
                <li>• iOS and Android compatibility verified</li>
                <li>• Real-time data sync operational</li>
                <li>• Payment processing configured</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Mobile Deployment Steps
              </h3>
              <ol className="text-sm text-blue-300/80 space-y-1">
                <li>1. Export project to GitHub repository</li>
                <li>2. Clone repository locally: <code className="bg-blue-500/20 px-1 rounded text-blue-300">git clone [repo-url]</code></li>
                <li>3. Install dependencies: <code className="bg-blue-500/20 px-1 rounded text-blue-300">npm install</code></li>
                <li>4. Add mobile platforms: <code className="bg-blue-500/20 px-1 rounded text-blue-300">npx cap add ios android</code></li>
                <li>5. Build project: <code className="bg-blue-500/20 px-1 rounded text-blue-300">npm run build</code></li>
                <li>6. Sync to mobile: <code className="bg-blue-500/20 px-1 rounded text-blue-300">npx cap sync</code></li>
                <li>7. Run on device: <code className="bg-blue-500/20 px-1 rounded text-blue-300">npx cap run ios</code> or <code className="bg-blue-500/20 px-1 rounded text-blue-300">npx cap run android</code></li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <h3 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Pre-deployment Checklist
              </h3>
              <div className="text-sm text-yellow-300/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-white/10 text-white/80 border-white/20">iOS</Badge>
                  <span>Requires macOS with Xcode installed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-white/10 text-white/80 border-white/20">Android</Badge>
                  <span>Requires Android Studio installed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-white/10 text-white/80 border-white/20">Testing</Badge>
                  <span>Test on physical devices before app store submission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-white/10 text-white/80 border-white/20">Production</Badge>
                  <span>Configure production API keys and domains</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
