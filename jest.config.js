const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  // Mirror the tsconfig '@/*' alias — jest.mock() resolves through jest-resolve,
  // which doesn't see next/jest's SWC baseUrl handling.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text'],
};

module.exports = createJestConfig(config);
