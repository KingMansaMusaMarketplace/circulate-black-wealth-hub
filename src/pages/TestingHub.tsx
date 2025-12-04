import { TestingMenu } from "@/components/testing/TestingMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube } from "lucide-react";

export default function TestingHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto p-6 max-w-6xl relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-white">
            <div className="p-2 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20">
              <TestTube className="w-8 h-8 text-yellow-400" />
            </div>
            Testing Hub
          </h1>
          <p className="text-blue-200">
            Tools to prepare and test your app for Apple Connect submission
          </p>
        </div>

        <Card className="mb-6 backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Apple Connect Preparation</CardTitle>
            <CardDescription className="text-blue-200">
              Before submitting to Apple, make sure to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-100/80">
              <li>Populate test data so reviewers see a working app</li>
              <li>Run the full app test to verify all functionality</li>
              <li>Fix any failed tests before submission</li>
              <li>Prepare test credentials for Apple reviewers</li>
              <li>Take screenshots showing the app with real content</li>
            </ol>
          </CardContent>
        </Card>

        <TestingMenu />
      </div>
    </div>
  );
}
