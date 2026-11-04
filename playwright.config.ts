import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright runner config for the vandenit-website T0 verify foundation
 * (task NEXT16-CONTENT-PIPELINE).
 *
 * FROZEN from the T0 baseline commit (NEXT16-CONTENT-PIPELINE): any change
 * escalates via the ./verify path-assertion-guard.
 *
 * The ./verify full → playwright-smoke step runs `pnpm exec playwright test`
 * with CI=1 after the production-build step, so `next start` below serves the
 * static production build of the just-built .next output. Routes are selected
 * in tests/e2e/smoke.spec.ts via data-testid anchors ONLY.
 */

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3457);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['line']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm start',
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});