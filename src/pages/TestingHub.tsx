import { TestingMenu } from "@/components/testing/TestingMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube } from "lucide-react";

export default function TestingHub() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TestTube className="w-8 h-8" />
          Testing Hub
        </h1>
        <p className="text-muted-foreground">
          Tools to prepare and test your app for Apple Connect submission
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Apple Connect Preparation</CardTitle>
          <CardDescription>
            Before submitting to Apple, make sure to:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
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
  );
}