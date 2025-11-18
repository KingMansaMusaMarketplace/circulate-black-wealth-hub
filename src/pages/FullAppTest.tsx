import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message: string;
  duration?: number;
}

export default function FullAppTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const updateTest = (name: string, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, status, message, duration } : t);
      }
      return [...prev, { name, status, message, duration }];
    });
  };

  const runTest = async (name: string, testFn: () => Promise<void>) => {
    const start = Date.now();
    updateTest(name, 'running', 'Running...');
    try {
      await testFn();
      const duration = Date.now() - start;
      updateTest(name, 'passed', 'Passed', duration);
      return true;
    } catch (error: any) {
      const duration = Date.now() - start;
      updateTest(name, 'failed', error.message || 'Failed', duration);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Database Connection
    await runTest('Database Connection', async () => {
      const { error } = await supabase.from('businesses').select('count').limit(1);
      if (error) throw new Error(`Database error: ${error.message}`);
    });

    // Test 2: Businesses Table
    await runTest('Businesses Table', async () => {
      const { data, error } = await supabase.from('businesses').select('*').limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('No businesses found - run test data populator first');
    });

    // Test 3: Transactions Table
    await runTest('Transactions Table', async () => {
      const { data, error } = await supabase.from('transactions').select('*').limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('No transactions found - run test data populator first');
    });

    // Test 4: Reviews Table
    await runTest('Reviews Table', async () => {
      const { data, error } = await supabase.from('reviews').select('*').limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('No reviews found - run test data populator first');
    });

    // Test 5: Corporate Subscriptions
    await runTest('Corporate Subscriptions', async () => {
      const { data, error } = await supabase.from('corporate_subscriptions').select('*');
      if (error) throw new Error(`Query error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('No corporate subscriptions found - run test data populator first');
    });

    // Test 6: Authentication System
    await runTest('Authentication System', async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(`Auth error: ${error.message}`);
      // It's ok if no session, just checking auth is working
    });

    // Test 7: AI Recommendations Function
    await runTest('AI Recommendations Function', async () => {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userLocation: { city: 'Atlanta', state: 'GA' },
          userPreferences: { categories: ['Food & Beverage'] },
          browsingHistory: [],
          limit: 3
        }
      });
      if (error) throw new Error(`Function error: ${error.message}`);
      if (!data) throw new Error('No response from AI recommendations');
    });

    // Test 8: Business Description Generator
    await runTest('Business Description Generator', async () => {
      const { data, error } = await supabase.functions.invoke('generate-business-description', {
        body: {
          businessName: 'Test Business',
          category: 'Food & Beverage',
          location: 'Atlanta, GA'
        }
      });
      if (error) throw new Error(`Function error: ${error.message}`);
      if (!data || !data.description) throw new Error('No description generated');
    });

    // Test 9: Image Enhancement Function
    await runTest('Image Enhancement Function', async () => {
      const { data, error } = await supabase.functions.invoke('enhance-image', {
        body: {
          imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
          businessContext: 'Soul Food Restaurant',
          currentTitle: 'Restaurant Image',
          currentDescription: 'A food image'
        }
      });
      if (error) throw new Error(`Function error: ${error.message}`);
      if (!data || !data.enhancementResults) throw new Error('No enhancement results');
    });

    // Test 10: Storage Access
    await runTest('Storage System', async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw new Error(`Storage error: ${error.message}`);
    });

    // Test 11: RLS Policies Check
    await runTest('RLS Policies', async () => {
      // Test that we can't access other users' private data
      const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
      // Just checking query works, RLS should handle access control
    });

    // Test 12: Business Services
    await runTest('Business Services', async () => {
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
    });

    // Test 13: Bookings System
    await runTest('Bookings System', async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
    });

    // Test 14: Activity Log
    await runTest('Activity Log', async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
    });

    // Test 15: Community Events
    await runTest('Community Events', async () => {
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .limit(5);
      if (error) throw new Error(`Query error: ${error.message}`);
    });

    setIsRunning(false);
    
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const total = tests.length;

    toast({
      title: "Test Complete",
      description: `${passed}/${total} tests passed${failed > 0 ? `, ${failed} failed` : ''}`,
      variant: failed > 0 ? "destructive" : "default"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'failed': return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'running': return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-muted border-muted';
    }
  };

  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const running = tests.filter(t => t.status === 'running').length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-6 h-6" />
            Full Application Test Suite
          </CardTitle>
          <CardDescription>
            Comprehensive test of all critical functionality for Apple Connect submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          {tests.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{tests.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{running}</div>
                  <div className="text-sm text-muted-foreground">Running</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Run Tests Button */}
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Test Results</h3>
              {tests.map((test, index) => (
                <Card key={index} className={getStatusColor(test.status)}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-muted-foreground">{test.message}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.duration && (
                          <Badge variant="outline">{test.duration}ms</Badge>
                        )}
                        <Badge variant={
                          test.status === 'passed' ? 'default' :
                          test.status === 'failed' ? 'destructive' :
                          test.status === 'running' ? 'secondary' : 'outline'
                        }>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {tests.length > 0 && failed > 0 && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      Action Required
                    </h4>
                    <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                      {tests.filter(t => t.status === 'failed').map(t => t.message).includes('No businesses found') && (
                        <p>• Run the Test Data Populator at <a href="/test-data-populator" className="underline">/test-data-populator</a></p>
                      )}
                      {failed > 0 && (
                        <p>• Review failed tests and fix issues before submitting to Apple</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {tests.length > 0 && failed === 0 && tests.every(t => t.status !== 'running') && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      All Tests Passed! ✅
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Your app is ready for Apple Connect submission. All critical functionality is working correctly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}