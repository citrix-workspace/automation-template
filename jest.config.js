module.exports = {
    coverageProvider: "v8",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    globalSetup: '<rootDir>/setup.js',
    globalTeardown: '<rootDir>/teardown.js',
    testEnvironment: "node",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
  };
  