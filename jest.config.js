export default {
  "preset": 'ts-jest/presets/js-with-ts-esm',
  "testEnvironment": 'node',
  'verbose': true,
  "roots": [
    "src",
  ],
  // "verbose": true,
  "moduleNameMapper": {
    '^/(.*)$': '<rootDir>/src/$1',
  },
  "transformIgnorePatterns": [
    "node_modules/(?!(three/examples)/)",
  ],
  "collectCoverage": false,
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
  ],
  "globals": {
    "ts-jest": {
      "useESM": true
    }
  },
  "setupFilesAfterEnv": ['./src/setupTests.ts']
}