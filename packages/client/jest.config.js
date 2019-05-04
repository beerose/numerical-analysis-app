module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // globalSetup: '<rootDir>/scripts/tests/setup.ts',
  // globalTeardown: '<rootDir>/scripts/tests/teardown.ts',
  testPathIgnorePatterns: ['/node_modules/'],
};
