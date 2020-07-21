module.exports = {
    coverageProvider: "v8",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "node",
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
  };
  