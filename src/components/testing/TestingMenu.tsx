import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Play, TestTube } from "lucide-react";

export function TestingMenu() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link to="/test-data-populator">
        <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Test Data Populator
            </CardTitle>
            <CardDescription>
              Populate your database with realistic test data for Apple review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Creates sample businesses, transactions, reviews, and sponsors
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/full-app-test">
        <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Full App Test
            </CardTitle>
            <CardDescription>
              Run comprehensive tests on all app functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tests database, edge functions, authentication, and more
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}