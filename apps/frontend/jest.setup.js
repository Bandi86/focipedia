import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Global test utilities
global.testUtils = {
  // Mock auth functions
  mockAuth: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
  
  // Mock API responses
  mockApiResponse: (data, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }),
  
  // Mock API error
  mockApiError: (message, status = 400) => ({
    response: {
      data: { message },
      status,
      statusText: 'Bad Request',
    },
  }),
  
  // Test user data
  testUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
  },
  
  // Test form data
  testFormData: {
    email: 'test@example.com',
    password: 'TestPass123',
    username: 'testuser',
    displayName: 'Test User',
  },
};

// Extend global types for test utilities
global.testUtils = {
  mockAuth: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
  mockApiResponse: jest.fn(),
  mockApiError: jest.fn(),
  testUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
  },
  testFormData: {
    email: 'test@example.com',
    password: 'TestPass123',
    username: 'testuser',
    displayName: 'Test User',
  },
};

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 