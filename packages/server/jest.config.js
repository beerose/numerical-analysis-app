module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/scripts/tests/setup.ts',
  globalTeardown: '<rootDir>/scripts/tests/teardown.ts',
  testPathIgnorePatterns: ['/node_modules/', '__tests__/blackbox/fetch.ts'],
};
