import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Ігноруємо e2e та .next
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
  // Покриття (за бажанням)
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/index.{ts,tsx}",
  ],
};

export default createJestConfig(customJestConfig);
