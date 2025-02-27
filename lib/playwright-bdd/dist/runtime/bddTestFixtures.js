"use strict";
/**
 * Test-scoped fixtures added by playwright-bdd.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const bddWorkerFixtures_1 = require("./bddWorkerFixtures");
const scenario_1 = require("../hooks/scenario");
const bddStepInvoker_1 = require("./bddStepInvoker");
// BDD fixtures prefixed with '$' to avoid collision with user's fixtures.
// Hide all BDD fixtures in reporter.
// 'box' option was added in PW 1.46,
// make type coercion to satisfy TS in early PW versions
const fixtureOptions = { scope: 'test', box: true };
exports.test = bddWorkerFixtures_1.test.extend({
    // apply timeout and slow from special tags in runtime instead of generating in test body
    // to have cleaner test body and track fixtures in timeout calculation.
    $applySpecialTags: [
        async ({ $bddTestData }, use, testInfo) => {
            if ($bddTestData?.timeout !== undefined)
                testInfo.setTimeout($bddTestData.timeout);
            if ($bddTestData?.slow)
                testInfo.slow();
            await use();
        },
        fixtureOptions,
    ],
    $bddContext: [
        async ({ $tags, $test, $bddConfig, $bddTestData, $uri, $step, $world }, use, testInfo) => {
            if (!$bddTestData)
                throw errorBddTestDataNotFound(testInfo);
            await use({
                config: $bddConfig,
                featureUri: $uri,
                testInfo,
                test: $test,
                tags: $tags,
                step: $step,
                stepIndex: -1,
                world: $world,
                bddTestData: $bddTestData,
            });
        },
        fixtureOptions,
    ],
    // Unused fixtures here are important:
    // - $applySpecialTags: to apply special tags before test run
    // - $beforeEach: to not run any steps in background's test.beforeEach
    //   because Playwright runs all before* hooks even in case of error in one of them
    //   See: https://github.com/microsoft/playwright/issues/28285
    Given: [
        async ({ $bddContext, $applySpecialTags, $beforeEach }, use) => {
            const invoker = new bddStepInvoker_1.BddStepInvoker($bddContext);
            await use(invoker.invoke.bind(invoker));
        },
        fixtureOptions,
    ],
    // All invoke step fixtures use the same Given fixture, b/c we get keyword from bddStepData
    When: [({ Given }, use) => use(Given), fixtureOptions],
    Then: [({ Given }, use) => use(Given), fixtureOptions],
    And: [({ Given }, use) => use(Given), fixtureOptions],
    But: [({ Given }, use) => use(Given), fixtureOptions],
    // For cucumber-style $world will be overwritten in test files
    // For playwright-style $world will be empty object
    // Note: although pw-style does not expect usage of world in steps,
    // some projects request it for better migration process from cucumber
    // See: https://github.com/vitalets/playwright-bdd/issues/208
    $world: [({}, use) => use({}), fixtureOptions],
    // init $bddFileData with empty array, will be overwritten in each BDD test file
    $bddFileData: [({}, use) => use([]), fixtureOptions],
    // bddTestData for particular test
    $bddTestData: [
        async ({ $bddFileData }, use, testInfo) => {
            const bddTestData = $bddFileData.find((data) => data.pwTestLine === testInfo.line);
            await use(bddTestData);
        },
        fixtureOptions,
    ],
    // particular test tags
    $tags: [({ $bddTestData }, use) => use($bddTestData?.tags || []), fixtureOptions],
    // init $test with base test, but it will be overwritten in test file
    $test: [({}, use) => use(bddWorkerFixtures_1.test), fixtureOptions],
    $testInfo: [({}, use, testInfo) => use(testInfo), fixtureOptions],
    // Info of the currently executed step.
    // Filled dynamically in step invoker.
    // Important to keep this fixture separate, without dependency on bddContext.
    // Otherwise we can get cyclic fixtures dependency.
    $step: [({}, use) => use({ title: '' }), fixtureOptions],
    // feature file uri, relative to configDir, will be overwritten in test file
    $uri: [({}, use) => use(''), fixtureOptions],
    // can be overwritten in test file if there are fixtures for beforeEach hooks
    $beforeEachFixtures: [({}, use) => use({}), fixtureOptions],
    // can be overwritten in test file if there are fixtures for afterEach hooks
    $afterEachFixtures: [({}, use) => use({}), fixtureOptions],
    // runs beforeEach hooks
    $beforeEach: [
        async ({ $bddContext, $beforeEachFixtures }, use) => {
            const hooksToRun = (0, scenario_1.getScenarioHooksToRun)('before', $bddContext.tags);
            await (0, scenario_1.runScenarioHooks)(hooksToRun, { $bddContext, ...$beforeEachFixtures });
            await use();
        },
        fixtureOptions,
    ],
    // runs afterEach hooks
    $afterEach: [
        async ({ $bddContext, $afterEachFixtures }, use) => {
            await use();
            const hooksToRun = (0, scenario_1.getScenarioHooksToRun)('after', $bddContext.tags);
            hooksToRun.reverse();
            await (0, scenario_1.runScenarioHooks)(hooksToRun, { $bddContext, ...$afterEachFixtures });
        },
        fixtureOptions,
    ],
});
function errorBddTestDataNotFound(testInfo) {
    const testLocation = testInfo.file + ':' + testInfo.line;
    return new Error(`bddTestData not found for test: ${testLocation}`);
}
//# sourceMappingURL=bddTestFixtures.js.map