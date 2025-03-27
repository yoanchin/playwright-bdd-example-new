import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.ts',
  outputDir: 'tests',
});

export default defineConfig({
  testDir,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  reporter: [  
  // [
  //   "./src/index.ts",
  //   {
  //     jira: {
  //       url: "https://client.atlassian.net/",
  //       type: "cloud", // cloud, server
  //       apiVersion: "1.0",
  //     },
  //     cloud: {
  //       client_id: "B013993C259B4E528537FC5BAB94B44D",
  //       client_secret: "6e7f761f4d67aa2e3e0c9fa77a6315b7d5ee682da8f8576563aad3bb680ec971",
  //     },
  //     testExecution: 'MYT-4',
  //     uploadScreenShot: true,
  //     uploadTrace: true,
  //   },
  // ],
    cucumberReporter('html', {
      outputFile: 'cucumber-report/index.html',
      externalAttachments: true,
      attachmentsBaseURL: 'http://127.0.0.1:8080/data',
    }),
    ['html', { open: 'never' }],
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
