"use strict";
/**
 * Test-scoped fixtures added by playwright-bdd.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const worker_1 = require("./worker");
const scenario_1 = require("../../hooks/scenario");
const invokeStep_1 = require("../invokeStep");
const bddMeta_1 = require("../../gen/bddMeta");
const enrichReporterData_1 = require("../../config/enrichReporterData");
const specialTags_1 = require("../../specialTags");
const bddAnnotation_1 = require("../bddAnnotation");
exports.test = worker_1.test.extend({
    // apply timeout and slow from special tags in runtime instead of generating in test body
    // to have cleaner test body and track fixtures in timeout calculation.
    $applySpecialTags: async ({ $bddTestMeta }, use, testInfo) => {
        const specialTags = new specialTags_1.SpecialTags($bddTestMeta?.ownTags, $bddTestMeta?.tags);
        if (specialTags.timeout !== undefined)
            testInfo.setTimeout(specialTags.timeout);
        if (specialTags.slow !== undefined)
            testInfo.slow();
        await use();
    },
    // $lang fixture can be overwritten in test file
    $lang: ({}, use) => use(''),
    $bddContext: async ({ $tags, $test, $step, $bddConfig, $lang, $bddTestMeta, $uri, $world }, use, testInfo) => {
        const bddAnnotation = $bddTestMeta && (0, enrichReporterData_1.getEnrichReporterData)($bddConfig)
            ? new bddAnnotation_1.BddAnnotation(testInfo, $bddTestMeta, $uri)
            : undefined;
        await use({
            config: $bddConfig,
            testInfo,
            test: $test,
            lang: $lang,
            tags: $tags,
            step: $step,
            world: $world,
            bddAnnotation,
        });
    },
    // Unused fixtures below are important for lazy initialization only on bdd projects
    // See: https://github.com/vitalets/playwright-bdd/issues/166
    Given: ({ $bddContext, $before, $applySpecialTags }, use) => use((0, invokeStep_1.createStepInvoker)($bddContext, 'Given')),
    When: ({ $bddContext, $before, $applySpecialTags }, use) => use((0, invokeStep_1.createStepInvoker)($bddContext, 'When')),
    Then: ({ $bddContext, $before, $applySpecialTags }, use) => use((0, invokeStep_1.createStepInvoker)($bddContext, 'Then')),
    And: ({ $bddContext, $before, $applySpecialTags }, use) => use((0, invokeStep_1.createStepInvoker)($bddContext, 'And')),
    But: ({ $bddContext, $before, $applySpecialTags }, use) => use((0, invokeStep_1.createStepInvoker)($bddContext, 'But')),
    // For cucumber-style $world will be overwritten in test files
    // For playwright-style $world will be empty object
    // Note: although pw-style does not expect usage of world / this in steps,
    // some projects request it for better migration process from cucumber
    // See: https://github.com/vitalets/playwright-bdd/issues/208
    $world: ({}, use) => use({}),
    // init $bddFileMeta with empty object, will be overwritten in each BDD test file
    $bddFileMeta: ({}, use) => use({}),
    // particular test meta
    $bddTestMeta: ({ $bddFileMeta }, use, testInfo) => use((0, bddMeta_1.getBddTestMeta)($bddFileMeta, testInfo)),
    // particular test tags
    $tags: ({ $bddTestMeta }, use) => use($bddTestMeta?.tags || []),
    // init $test with base test, but it will be overwritten in test file
    $test: ({}, use) => use(worker_1.test),
    $testInfo: ({}, use, testInfo) => use(testInfo),
    $step: ({}, use) => use({ title: '' }),
    // feature file uri, relative to configDir, will be overwritten in test file
    $uri: ({}, use) => use(''),
    // can be overwritten in test file if there are scenario hooks
    $scenarioHookFixtures: ({}, use) => use({}),
    $before: 
    // Unused dependencies are important:
    // 1. $beforeAll / $afterAll: in pw < 1.39 worker-scoped auto-fixtures were called after test-scoped
    // 2. $after: to call after hooks in case of errors in before hooks
    async ({ $scenarioHookFixtures, $bddContext, $tags, $beforeAll, $afterAll, $after }, use, $testInfo) => {
        await (0, scenario_1.runScenarioHooks)('before', {
            $bddContext,
            $tags,
            $testInfo,
            ...$scenarioHookFixtures,
        });
        await use();
    },
    $after: async ({ $scenarioHookFixtures, $bddContext, $tags }, use, $testInfo) => {
        await use();
        await (0, scenario_1.runScenarioHooks)('after', {
            $bddContext,
            $tags,
            $testInfo,
            ...$scenarioHookFixtures,
        });
    },
});
//# sourceMappingURL=test.js.map