"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playwrightStepCtor = playwrightStepCtor;
const fixtureParameterNames_1 = require("../../playwright/fixtureParameterNames");
const getLocationInFile_1 = require("../../playwright/getLocationInFile");
const stepRegistry_1 = require("../stepRegistry");
const shared_1 = require("./shared");
// typings here are vague, we set exact typings inside createBdd()
function playwrightStepCtor(keyword, { customTest, defaultTags }) {
    return (...args) => {
        const { pattern, providedOptions, fn } = (0, shared_1.parseStepDefinitionArgs)(args);
        (0, stepRegistry_1.registerStepDefinition)({
            keyword,
            pattern,
            fn,
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
            customTest,
            defaultTags,
            providedOptions,
        });
        return getCallableStepFn(pattern, fn);
    };
}
/**
 * Returns wrapped step function to be called from other steps.
 * See: https://github.com/vitalets/playwright-bdd/issues/110
 */
function getCallableStepFn(pattern, fn) {
    return function (...args) {
        const [fixtures, ...params] = args;
        assertStepIsCalledWithRequiredFixtures(pattern, fn, fixtures);
        return fn.call(this, fixtures, ...params);
    };
}
function assertStepIsCalledWithRequiredFixtures(pattern, fn, passedFixtures = {}) {
    const requiredFixtures = (0, fixtureParameterNames_1.fixtureParameterNames)(fn);
    const missingFixtures = requiredFixtures.filter((fixtureName) => !Object.hasOwn(passedFixtures, fixtureName));
    if (missingFixtures.length) {
        throw new Error([
            `Invocation of step "${pattern}" from another step does not pass all required fixtures.`,
            `Missing fixtures: ${missingFixtures.join(', ')}`,
        ].join(' '));
    }
}
//# sourceMappingURL=playwrightStyle.js.map