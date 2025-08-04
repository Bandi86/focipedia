import { config } from 'dotenv';

// Load environment variables for testing
config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Setup test database or other global test requirements
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup test database or other global test cleanup
  console.log('Cleaning up test environment...');
});

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
  generateTestUser: () => ({
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123',
    username: `testuser-${Date.now()}`,
    displayName: 'Test User',
  }),
  
  generateTestToken: () => 'test-jwt-token',
  
  mockAuthUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
  },
};

// Extend global types for test utilities
declare global {
  var testUtils: {
    generateTestUser: () => {
      email: string;
      password: string;
      username: string;
      displayName: string;
    };
    generateTestToken: () => string;
    mockAuthUser: {
      id: string;
      email: string;
      username: string;
      displayName: string;
    };
  };
} 