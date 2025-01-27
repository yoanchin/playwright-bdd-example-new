"use strict";
/**
 * Scenario level hooks: Before / After.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioHookFactory = scenarioHookFactory;
exports.runScenarioHooks = runScenarioHooks;
exports.getScenarioHooksFixtureNames = getScenarioHooksFixtureNames;
exports.getScenarioHooksToRun = getScenarioHooksToRun;
const fixtureParameterNames_1 = require("../playwright/fixtureParameterNames");
const utils_1 = require("../utils");
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const runStepWithLocation_1 = require("../playwright/runStepWithLocation");
const bddTestFixturesAuto_1 = require("../runtime/bddTestFixturesAuto");
const shared_1 = require("./shared");
const scenarioHooks = [];
/**
 * Returns Before() / After() functions.
 */
function scenarioHookFactory(type, { customTest, defaultTags, worldFixture }) {
    return (...args) => {
        addHook({
            type,
            options: getOptionsFromArgs(args),
            fn: getFnFromArgs(args),
            // offset = 3 b/c this call is 3 steps below the user's code
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
            customTest,
            defaultTags,
            worldFixture,
        });
    };
}
// eslint-disable-next-line visual/complexity
async function runScenarioHooks(hooks, fixtures) {
    let error;
    for (const hook of hooks) {
        try {
            await runScenarioHook(hook, fixtures);
        }
        catch (e) {
            if (hook.type === 'before')
                throw e;
            if (!error)
                error = e;
        }
    }
    if (error)
        throw error;
}
async function runScenarioHook(hook, fixtures) {
    const fn = wrapHookFnWithTimeout(hook, fixtures);
    const stepTitle = getHookStepTitle(hook);
    await (0, runStepWithLocation_1.runStepWithLocation)(fixtures.$bddContext.test, stepTitle, hook.location, fn);
}
function getScenarioHooksFixtureNames(hooks) {
    const fixtureNames = new Set();
    hooks.forEach((hook) => {
        const hookFixtureNames = (0, fixtureParameterNames_1.fixtureParameterNames)(hook.fn);
        hookFixtureNames.forEach((fixtureName) => fixtureNames.add(fixtureName));
    });
    return [...fixtureNames].filter((name) => !(0, bddTestFixturesAuto_1.isBddAutoInjectFixture)(name));
}
function getScenarioHooksToRun(type, tags = []) {
    return scenarioHooks
        .filter((hook) => hook.type === type)
        .filter((hook) => !hook.tagsExpression || hook.tagsExpression.evaluate(tags));
}
/**
 * Wraps hook fn with timeout.
 */
function wrapHookFnWithTimeout(hook, fixtures) {
    const { timeout } = hook.options;
    const { $bddContext } = fixtures;
    const fixturesArg = {
        ...fixtures,
        ...(0, bddTestFixturesAuto_1.getBddAutoInjectFixtures)($bddContext),
    };
    return async () => {
        await (0, utils_1.callWithTimeout)(() => hook.fn.call($bddContext.world, fixturesArg), timeout, getTimeoutMessage(hook));
    };
}
function getOptionsFromArgs(args) {
    if (typeof args[0] === 'string')
        return { tags: args[0] };
    if (typeof args[0] === 'object')
        return args[0];
    return {};
}
function getFnFromArgs(args) {
    return args.length === 1 ? args[0] : args[1];
}
function addHook(hook) {
    (0, shared_1.setTagsExpression)(hook);
    scenarioHooks.push(hook);
}
function getTimeoutMessage(hook) {
    const { timeout, name: hookName } = hook.options;
    return `${hook.type} hook ${hookName ? `"${hookName}" ` : ''}timeout (${timeout} ms)`;
}
function getHookStepTitle(hook) {
    return hook.options.name || (hook.type === 'before' ? 'BeforeEach hook' : 'AfterEach hook');
}
//# sourceMappingURL=scenario.js.map