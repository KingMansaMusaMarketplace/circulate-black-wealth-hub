
export interface RouteTest {
  path: string;
  name: string;
  status: 'pending' | 'pass' | 'fail' | 'warning';
  message: string;
  requiresAuth?: boolean;
}

export interface RouteTestResults {
  passed: number;
  failed: number;
  warnings: number;
  total: number;
}
