
export default {
  // Use Node environment for testing
  testEnvironment: 'node',
  
  // Transform ES modules using Babel
  transform: {},
  
  // File extensions to consider
  moduleFileExtensions: ['js'],
  
  // Enable experimental VM modules for ESM support
  testMatch: ['**/tests/**/*.test.js'],
  
  // Coverage configuration - Exclude models and routes (just schemas/configs)
  collectCoverageFrom: [
    'controllers/**/*.js',
    '!node_modules/**'
  ],
  
  // Coverage thresholds - Focused on business logic (controllers + middleware)
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 90,
      lines: 84,
      statements: 80
    }
  }
};
