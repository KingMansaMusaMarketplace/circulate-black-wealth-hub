
// Define the return type for the initialization functions
export interface InitDbSuccessResult {
  success: true;
}

export interface InitDbErrorResult {
  success: false;
  error: any;
}

export interface InitDbDemoResult {
  success: false;
  isDemo: true;
}

export type InitDbResult = InitDbSuccessResult | InitDbErrorResult | InitDbDemoResult;
