
export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  critical: boolean;
}

export interface TestSummaryProps {
  tests: TestResult[];
  passedCritical: number;
  failedCritical: number;
  isRunning: boolean;
  progress: number;
  currentTest: string | null;
  onRunAllTests: () => void;
}

export interface TestSectionProps {
  title: string;
  tests: TestResult[];
  icon: React.ComponentType<{ className?: string }>;
}

export interface SystemHealthProps {
  tests: TestResult[];
}
