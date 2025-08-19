/**
 * Jest Global Teardown
 * Runs once after all tests
 */

module.exports = async () => {
  // Clean up any global resources
  console.log('🏁 Test suite completed');
  
  // Generate test summary
  const testResults = global.__JEST_TEST_RESULTS__ || {};
  
  if (testResults.numFailedTests > 0) {
    console.log(`❌ ${testResults.numFailedTests} test(s) failed`);
  }
  
  if (testResults.numPassedTests > 0) {
    console.log(`✅ ${testResults.numPassedTests} test(s) passed`);
  }
  
  // Clean up environment
  delete process.env.NODE_ENV;
  delete process.env.REACT_APP_API_URL;
  delete process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  delete process.env.REACT_APP_EMAIL_SERVICE_URL;
};