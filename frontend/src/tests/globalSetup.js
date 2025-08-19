/**
 * Jest Global Setup
 * Runs once before all tests
 */

module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
  process.env.REACT_APP_STRIPE_PUBLIC_KEY = 'pk_test_mock_key';
  process.env.REACT_APP_EMAIL_SERVICE_URL = 'http://localhost:3001/api/email';
  
  // Mock console methods to reduce noise
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  
  // Set up performance monitoring
  global.performance = global.performance || {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  };
  
  console.log('🚀 Starting test suite...');
};