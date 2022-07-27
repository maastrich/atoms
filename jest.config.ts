import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globalSetup: "./jest.setup.ts",
};

export default config;
