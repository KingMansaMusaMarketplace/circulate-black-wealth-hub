import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export function TestingMenu() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link to="/full-app-test">
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              Full App Test
            </CardTitle>
            <CardDescription className="text-blue-200">
              Run comprehensive tests on all app functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100/70">
              Tests database, edge functions, authentication, and more
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
