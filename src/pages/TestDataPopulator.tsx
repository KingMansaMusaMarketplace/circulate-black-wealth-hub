import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react";

export default function TestDataPopulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const populateTestData = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('populate-test-data', {
        body: {}
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Success!",
        description: "Test data has been populated successfully.",
      });
    } catch (error: any) {
      console.error('Error populating test data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to populate test data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Test Data Populator
          </CardTitle>
          <CardDescription>
            Populate your database with realistic test data for Apple Connect review.
            This will add sample businesses, transactions, reviews, and corporate subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What will be created:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 5 verified businesses across different categories</li>
              <li>• 2 corporate sponsors (Platinum & Gold tier)</li>
              <li>• 3 sample transactions</li>
              <li>• 3 business reviews with ratings</li>
            </ul>
          </div>

          <Button 
            onClick={populateTestData} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Populating Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Populate Test Data
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Data Populated Successfully!
                    </h4>
                    <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                      <p>✓ {result.data.businesses} businesses created</p>
                      <p>✓ {result.data.subscriptions} corporate subscriptions created</p>
                      <p>✓ {result.data.transactions} transactions created</p>
                      <p>✓ {result.data.reviews} reviews created</p>
                      <p className="mt-3 font-mono text-xs">Test User ID: {result.data.testUserId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Note
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  This creates test data for demonstration purposes. You can run this multiple times,
                  but be aware it will create duplicate entries. For production, you'll want to clean
                  this test data and replace it with real content.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}