# Testing Setup & Best Practices

## Overview

This document outlines the comprehensive testing setup implemented for the Focipedia project, covering both backend (NestJS) and frontend (Next.js) testing strategies.

## Backend Testing (NestJS)

### Test Structure

```
apps/backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.spec.ts      # Service unit tests
│   │   │   └── auth.controller.spec.ts   # Controller unit tests
│   │   └── user/
│   │       └── user.service.spec.ts      # Service unit tests
│   └── test/
│       ├── jest-e2e.json                 # E2E test configuration
│       └── setup.ts                      # Test setup utilities
```

### Test Configuration

#### Jest Configuration (`package.json`)

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["src/**/*.(t|j)s"],
    "coverageDirectory": "./coverage",
    "testEnvironment": "node"
  }
}
```

#### E2E Test Configuration (`test/jest-e2e.json`)

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.(t|j)s",
    "!src/**/*.spec.ts",
    "!src/**/*.e2e-spec.ts",
    "!src/main.ts",
    "!src/**/index.ts"
  ],
  "coverageDirectory": "./coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "setupFilesAfterEnv": ["<rootDir>/test/setup.ts"],
  "testTimeout": 30000,
  "verbose": true,
  "forceExit": true,
  "clearMocks": true,
  "resetMocks": true,
  "restoreMocks": true
}
```

### Test Setup (`test/setup.ts`)

```typescript
import { config } from "dotenv";

// Load environment variables for testing
config({ path: ".env.test" });

// Global test setup
beforeAll(async () => {
  console.log("Setting up test environment...");
});

afterAll(async () => {
  console.log("Cleaning up test environment...");
});

// Global test utilities
global.testUtils = {
  generateTestUser: () => ({
    email: `test-${Date.now()}@example.com`,
    password: "TestPass123",
    username: `testuser-${Date.now()}`,
    displayName: "Test User",
  }),

  generateTestToken: () => "test-jwt-token",

  mockAuthUser: {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    displayName: "Test User",
  },
};
```

### Testing Best Practices

#### 1. Service Testing

- **Mock Dependencies**: Use Jest mocks for external dependencies (Prisma, JWT, etc.)
- **Test All Methods**: Cover all public methods with positive and negative test cases
- **Edge Cases**: Test error conditions, null values, and boundary conditions
- **Database Operations**: Mock Prisma client to avoid actual database calls

#### 2. Controller Testing

- **Unit Tests**: Test controller methods directly with mocked services
- **Input Validation**: Test DTO validation and error handling
- **Response Format**: Verify correct response structure and status codes
- **Authentication**: Test protected routes with mocked JWT guards

#### 3. Mocking Strategy

```typescript
// Mock PrismaClient
const mockPrismaClient = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock argon2
jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));
```

### Test Coverage

#### AuthService Tests (39 tests)

- ✅ User registration (success, duplicate email/username, database errors)
- ✅ User login (success, invalid credentials, missing user)
- ✅ Token refresh (success, invalid token, missing user)
- ✅ Password validation and hashing
- ✅ Error handling and edge cases

#### UserService Tests

- ✅ User retrieval by ID and email
- ✅ User profile updates
- ✅ Password changes
- ✅ User deletion
- ✅ Null profile handling

#### AuthController Tests

- ✅ Registration endpoint
- ✅ Login endpoint
- ✅ Token refresh endpoint
- ✅ Logout endpoint
- ✅ Error handling

## Frontend Testing (Next.js)

### Test Structure

```
apps/frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.test.tsx        # Form component tests
│   │   │   └── RegisterForm.test.tsx     # Form component tests
│   │   └── ui/
│   │       ├── button.test.tsx           # UI component tests
│   │       └── input.test.tsx            # UI component tests
│   └── jest.config.js                    # Jest configuration
├── jest.setup.js                         # Test setup
└── package.json                          # Test scripts
```

### Test Configuration

#### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/index.{js,jsx,ts,tsx}",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
    "!src/app/globals.css",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

module.exports = createJestConfig(customJestConfig);
```

#### Test Setup (`jest.setup.js`)

```javascript
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
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
    return "/";
  },
}));

// Mock Next.js image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} alt={props.alt || ""} />;
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
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
  mockAuth: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
  mockApiResponse: (data, status = 200) => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {},
  }),
  mockApiError: (message, status = 400) => ({
    response: {
      data: { message },
      status,
      statusText: "Bad Request",
    },
  }),
  testUser: {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    displayName: "Test User",
  },
  testFormData: {
    email: "test@example.com",
    password: "TestPass123",
    username: "testuser",
    displayName: "Test User",
  },
};
```

### Testing Best Practices

#### 1. Component Testing

- **User Interactions**: Test user interactions using `@testing-library/user-event`
- **Accessibility**: Test ARIA attributes and keyboard navigation
- **Form Validation**: Test form validation and error states
- **Loading States**: Test loading and error states
- **Props Testing**: Test component behavior with different props

#### 2. Form Testing

- **Validation**: Test form validation rules and error messages
- **Submission**: Test form submission with valid and invalid data
- **API Integration**: Mock API calls and test error handling
- **User Experience**: Test form flow and user feedback

#### 3. UI Component Testing

- **Rendering**: Test component rendering with different variants
- **Styling**: Test CSS classes and styling variants
- **Interactions**: Test click events, keyboard navigation
- **Accessibility**: Test ARIA attributes and screen reader support

### Test Coverage

#### Component Tests

- ✅ Button component (rendering, interactions, accessibility)
- ✅ Input component (rendering, validation, accessibility)
- ✅ LoginForm component (form validation, submission, error handling)
- ✅ RegisterForm component (form validation, submission, error handling)

#### Test Categories

- **Rendering Tests**: Verify components render correctly
- **Interaction Tests**: Test user interactions and events
- **Validation Tests**: Test form validation and error states
- **Accessibility Tests**: Test ARIA attributes and keyboard navigation
- **Error Handling Tests**: Test error states and error boundaries

## Running Tests

### Backend Tests

```bash
# Run all tests
cd apps/backend
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test -- auth.service.spec.ts
```

### Frontend Tests

```bash
# Run all tests
cd apps/frontend
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test -- button.test.tsx
```

### Root Level Tests

```bash
# Run all tests across the monorepo
pnpm test

# Run tests for specific package
pnpm --filter @focipedia/backend test
pnpm --filter frontend test
```

## Test Commands

### Backend Commands

- `pnpm test` - Run unit tests
- `pnpm test:cov` - Run tests with coverage
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:debug` - Run tests in debug mode

### Frontend Commands

- `pnpm test` - Run unit tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:watch` - Run tests in watch mode

## Coverage Requirements

### Backend Coverage

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Frontend Coverage

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Best Practices Summary

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern (Arrange, Act, Assert)

### 2. Mocking Strategy

- Mock external dependencies (databases, APIs, etc.)
- Use Jest mocks for consistent behavior
- Mock at the right level (service vs. component)

### 3. Test Data

- Use factory functions for test data
- Create realistic test scenarios
- Test edge cases and error conditions

### 4. Assertions

- Use specific assertions (toBe, toEqual, toHaveBeenCalledWith)
- Test both positive and negative cases
- Verify error messages and status codes

### 5. Performance

- Keep tests fast and focused
- Use proper cleanup in afterEach/afterAll
- Avoid testing implementation details

## Continuous Integration

### GitHub Actions (Recommended)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: pnpm install
      - run: pnpm --filter @focipedia/backend test
      - run: pnpm --filter @focipedia/backend test:cov

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: pnpm install
      - run: pnpm --filter frontend test
      - run: pnpm --filter frontend test:coverage
```

## Conclusion

This testing setup provides comprehensive coverage for both backend and frontend components, ensuring code quality and reliability. The tests follow modern best practices and are designed to catch issues early in the development process.

Key benefits:

- ✅ High test coverage (80%+)
- ✅ Fast test execution
- ✅ Comprehensive error testing
- ✅ Accessibility testing
- ✅ User interaction testing
- ✅ Mocked external dependencies
- ✅ CI/CD integration ready
