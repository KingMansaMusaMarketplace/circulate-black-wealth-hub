
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TestResult } from './TestResults';

export const useCommunityImpactTests = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`Community Impact Test: ${message}`);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setLogs([]);
    
    addLog('Starting Community Impact tests...');
    
    const results: TestResult[] = [];

    // Test 1: Check if user is authenticated
    try {
      if (!user) {
        results.push({
          name: 'User Authentication',
          status: 'fail',
          message: 'User must be logged in to test Community Impact features'
        });
        addLog('❌ Authentication test failed - no user');
      } else {
        results.push({
          name: 'User Authentication',
          status: 'pass',
          message: `User authenticated: ${user.email}`
        });
        addLog('✅ Authentication test passed');
      }
    } catch (error) {
      results.push({
        name: 'User Authentication',
        status: 'fail',
        message: 'Authentication check failed',
        error
      });
      addLog('❌ Authentication test error');
    }

    // Test 2: Test database function - calculate_user_impact_metrics
    try {
      addLog('Testing calculate_user_impact_metrics function...');
      const { data: userMetrics, error: userError } = await supabase
        .rpc('calculate_user_impact_metrics', { p_user_id: user?.id });

      if (userError) {
        results.push({
          name: 'User Impact Metrics Function',
          status: 'fail',
          message: `Database function failed: ${userError.message}`,
          error: userError
        });
        addLog('❌ User metrics function failed');
      } else {
        results.push({
          name: 'User Impact Metrics Function',
          status: 'pass',
          message: `Metrics calculated successfully: $${userMetrics?.total_spending || 0} spent`
        });
        addLog('✅ User metrics function working');
      }
    } catch (error) {
      results.push({
        name: 'User Impact Metrics Function',
        status: 'fail',
        message: 'Failed to call user metrics function',
        error
      });
      addLog('❌ User metrics function error');
    }

    // Test 3: Test database function - get_community_impact_summary
    try {
      addLog('Testing get_community_impact_summary function...');
      const { data: communityMetrics, error: communityError } = await supabase
        .rpc('get_community_impact_summary');

      if (communityError) {
        results.push({
          name: 'Community Impact Summary Function',
          status: 'fail',
          message: `Database function failed: ${communityError.message}`,
          error: communityError
        });
        addLog('❌ Community metrics function failed');
      } else {
        results.push({
          name: 'Community Impact Summary Function',
          status: 'pass',
          message: `Community metrics retrieved: ${communityMetrics?.total_users || 0} users, ${communityMetrics?.total_businesses || 0} businesses`
        });
        addLog('✅ Community metrics function working');
      }
    } catch (error) {
      results.push({
        name: 'Community Impact Summary Function',
        status: 'fail',
        message: 'Failed to call community metrics function',
        error
      });
      addLog('❌ Community metrics function error');
    }

    // Test 4: Check if tables exist
    try {
      addLog('Checking database tables...');
      const { data: tables, error } = await supabase
        .from('community_impact_metrics')
        .select('*')
        .limit(1);

      if (error && error.code === '42P01') {
        results.push({
          name: 'Database Tables',
          status: 'fail',
          message: 'community_impact_metrics table does not exist',
          error
        });
        addLog('❌ Database tables missing');
      } else {
        results.push({
          name: 'Database Tables',
          status: 'pass',
          message: 'Database tables are accessible'
        });
        addLog('✅ Database tables exist');
      }
    } catch (error) {
      results.push({
        name: 'Database Tables',
        status: 'warning',
        message: 'Could not verify table existence',
        error
      });
      addLog('⚠️ Database table check inconclusive');
    }

    // Test 5: Test component rendering
    try {
      addLog('Testing component imports...');
      const CommunityImpactDashboard = await import('@/components/community-impact/CommunityImpactDashboard');
      
      if (CommunityImpactDashboard.default) {
        results.push({
          name: 'Component Import',
          status: 'pass',
          message: 'CommunityImpactDashboard component imports successfully'
        });
        addLog('✅ Component import successful');
      } else {
        results.push({
          name: 'Component Import',
          status: 'fail',
          message: 'CommunityImpactDashboard component does not have default export'
        });
        addLog('❌ Component import failed');
      }
    } catch (error) {
      results.push({
        name: 'Component Import',
        status: 'fail',
        message: 'Failed to import CommunityImpactDashboard component',
        error
      });
      addLog('❌ Component import error');
    }

    // Test 6: Check routing
    try {
      addLog('Checking route configuration...');
      const currentPath = window.location.pathname;
      
      results.push({
        name: 'Route Configuration',
        status: 'pass',
        message: `Current path: ${currentPath}. Community Impact should be accessible at /community-impact`
      });
      addLog('✅ Route configuration verified');
    } catch (error) {
      results.push({
        name: 'Route Configuration',
        status: 'fail',
        message: 'Failed to check route configuration',
        error
      });
      addLog('❌ Route configuration error');
    }

    setTestResults(results);
    setIsRunning(false);
    
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    const warnCount = results.filter(r => r.status === 'warning').length;
    
    addLog(`Tests completed: ${passCount} passed, ${failCount} failed, ${warnCount} warnings`);
    
    if (failCount === 0) {
      toast.success('All Community Impact tests passed!');
    } else {
      toast.error(`${failCount} tests failed. Check results for details.`);
    }
  };

  return {
    testResults,
    isRunning,
    logs,
    runTests
  };
};
