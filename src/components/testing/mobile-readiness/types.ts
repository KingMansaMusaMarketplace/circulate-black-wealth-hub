
export interface TestResult {
  name: string;
  category: 'critical' | 'important' | 'optional';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
  error?: any;
}

export interface TestStats {
  passCount: number;
  failCount: number;
  warningCount: number;
  criticalFailCount: number;
}
