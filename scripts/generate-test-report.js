
const fs = require('fs');
const path = require('path');

/**
 * Generate a comprehensive test report for Xcode Cloud
 */
function generateTestReport() {
  console.log('📊 Generating comprehensive test report...');
  
  const testResultsDir = path.join(__dirname, '../test-results');
  const reportFile = path.join(testResultsDir, 'comprehensive-report.json');
  
  // Ensure test results directory exists
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
  
  const testFiles = [
    'unit-tests.json',
    'component-tests.json',
    'auth-tests.json',
    'subscription-tests.json',
    'geolocation-tests.json',
    'camera-tests.json'
  ];
  
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.CI_WORKFLOW || 'local',
    branch: process.env.CI_BRANCH || 'unknown',
    commit: process.env.CI_COMMIT || 'unknown',
    buildNumber: process.env.CI_BUILD_NUMBER || 'unknown',
    testSuites: [],
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0
    }
  };
  
  // Process each test file
  testFiles.forEach(fileName => {
    const filePath = path.join(testResultsDir, fileName);
    
    if (fs.existsSync(filePath)) {
      try {
        const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const suite = {
          name: fileName.replace('.json', ''),
          tests: testData.numTotalTests || 0,
          passed: testData.numPassedTests || 0,
          failed: testData.numFailedTests || 0,
          skipped: testData.numPendingTests || 0,
          duration: testData.testResults?.[0]?.endTime - testData.testResults?.[0]?.startTime || 0
        };
        
        report.testSuites.push(suite);
        
        // Update summary
        report.summary.totalTests += suite.tests;
        report.summary.passedTests += suite.passed;
        report.summary.failedTests += suite.failed;
        report.summary.skippedTests += suite.skipped;
        report.summary.duration += suite.duration;
        
      } catch (error) {
        console.warn(`⚠️ Could not parse test file ${fileName}:`, error.message);
      }
    }
  });
  
  // Calculate success rate
  report.summary.successRate = report.summary.totalTests > 0 
    ? (report.summary.passedTests / report.summary.totalTests * 100).toFixed(2) + '%'
    : '0%';
  
  // Write comprehensive report
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log('✅ Test report generated successfully!');
  console.log(`📈 Success Rate: ${report.summary.successRate}`);
  console.log(`🧪 Total Tests: ${report.summary.totalTests}`);
  console.log(`✅ Passed: ${report.summary.passedTests}`);
  console.log(`❌ Failed: ${report.summary.failedTests}`);
  
  // Exit with error code if tests failed
  if (report.summary.failedTests > 0) {
    console.error('❌ Some tests failed!');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateTestReport();
}

module.exports = { generateTestReport };
