/**
 * Jest Configuration for SU Curries Frontend
 * Simplified configuration for React Testing Library
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  
  // Module name mapping for CSS modules and assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/tests/mocks/fileMock.js',
    '^axios$': '<rootDir>/src/__mocks__/axios.ts',
    '^@stripe/stripe-js$': '<rootDir>/src/__mocks__/@stripe/stripe-js.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/dist/',
  ],
  
  // Transform files (use default React Scripts transform)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }],
  },
  
  // Files to ignore during transformation
  transformIgnorePatterns: [
    'node_modules/(?!(axios|react-markdown|remark-.*|rehype-.*|unified|bail|is-plain-obj|trough|vfile|unist-.*|mdast-.*|micromark|decode-named-character-reference|character-entities|property-information|hast-.*|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch|html-void-elements)/)',
  ],
  
  // Coverage configuration (simplified)
  collectCoverage: false, // Disable for now to avoid issues
  
  // Test timeout
  testTimeout: 10000,
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // File extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Notify mode (disabled)
  notify: false,
  
  // Max workers for parallel execution
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
};