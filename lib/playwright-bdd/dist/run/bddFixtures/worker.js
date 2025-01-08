"use strict";
/**
 * Worker-scoped fixtures added by playwright-bdd.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test_1 = require("@playwright/test");
const env_1 = require("../../config/env");
const configDir_1 = require("../../config/configDir");
const worker_1 = require("../../hooks/worker");
const load_1 = require("../../steps/load");
exports.test = test_1.test.extend({
    $bddConfig: [
        async ({}, use, workerInfo) => {
            const config = (0, env_1.getConfigFromEnv)(workerInfo.project.testDir);
            const cwd = (0, configDir_1.getPlaywrightConfigDir)();
            const stepFiles = await (0, load_1.resolveStepFiles)(cwd, config.steps);
            await (0, load_1.loadSteps)(stepFiles);
            await use(config);
        },
        { scope: 'worker' },
    ],
    // can be overwritten in test file if there are worker hooks
    $workerHookFixtures: [({}, use) => use({}), { scope: 'worker' }],
    $beforeAll: [
        // Important unused dependencies:
        // 1. $afterAll: in pw < 1.39 worker-scoped auto-fixtures are called in incorrect order
        // 2. $bddConfig: to load hooks before this fixtures
        async ({ $workerHookFixtures, $bddConfig }, use, $workerInfo) => {
            await (0, worker_1.runWorkerHooks)('beforeAll', { $workerInfo, ...$workerHookFixtures });
            await use();
        },
        { scope: 'worker' },
    ],
    $afterAll: [
        // Important unused dependencies:
        // 1. $bddConfig: to load hooks before this fixtures
        async ({ $workerHookFixtures, $bddConfig }, use, $workerInfo) => {
            await use();
            await (0, worker_1.runWorkerHooks)('afterAll', { $workerInfo, ...$workerHookFixtures });
        },
        { scope: 'worker' },
    ],
});
//# sourceMappingURL=worker.js.map