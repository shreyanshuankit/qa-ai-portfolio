import { defineConfig, devices } from '@playwright/test';

/**
 * Sample / demo Playwright config.
 * Targets are public practice sites only. Workers are limited to be polite
 * to those shared services.
 */
export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // No browser needed; APIRequestContext is used in the tests.
        baseURL: 'https://reqres.in',
      },
    },
  ],
});
