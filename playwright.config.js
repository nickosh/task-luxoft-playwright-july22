// playwright.config.js
// @ts-check
const { expect } = require("@playwright/test");
const { matchers } = require("expect-playwright");

expect.extend(matchers);

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    testDir: "tests",
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
    timeout: 80000,

    reporter: [[process.env.CI ? "dot" : "list"], ["html", { open: "never" }]],
    use: {
        browserName: "chromium",
        headless: false,

        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: false,
        screenshot: "only-on-failure",
        video: "on-first-retry",
        trace: "retain-on-failure",
        /* launchOptions: {
            slowMo: 100,
        }, */
    },
};

module.exports = config;
