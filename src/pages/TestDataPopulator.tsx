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
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="w-6 h-6 text-blue-400" />
            Test Data Populator
          </CardTitle>
          <CardDescription className="text-white/70">
            Populate your database with realistic test data for Apple Connect review.
            This will add sample businesses, transactions, reviews, and corporate subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-white">What will be created:</h3>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• 5 verified businesses across different categories</li>
              <li>• 2 corporate sponsors (Platinum & Gold tier)</li>
              <li>• 3 sample transactions</li>
              <li>• 3 business reviews with ratings</li>
            </ul>
          </div>

          <Button 
            onClick={populateTestData} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
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
            <Card className="border-green-500/30 bg-green-950/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-100 mb-2">
                      Data Populated Successfully!
                    </h4>
                    <div className="space-y-1 text-sm text-green-200">
                      <p>✓ {result.data.businesses} businesses created</p>
                      <p>✓ {result.data.subscriptions} corporate subscriptions created</p>
                      <p>✓ {result.data.transactions} transactions created</p>
                      <p>✓ {result.data.reviews} reviews created</p>
                      <p className="mt-3 font-mono text-xs text-green-300">Test User ID: {result.data.testUserId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-yellow-950/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-100 mb-1">
                  Note
                </h4>
                <p className="text-sm text-yellow-200">
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
    </div>
  );
}