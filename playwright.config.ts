import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.ts',
});

export default defineConfig({
  testDir,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  reporter: 
  [
    ['list'],
    ['json', {  outputFile: 'test-results.json' }],
    cucumberReporter('html', { outputFile: 'actual-reports/report.html' })
  ],
  use: {
    screenshot: 'on',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
