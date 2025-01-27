"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cucumberStepCtor = cucumberStepCtor;
/**
 * New cucumber-style steps where Given/When/Then are not imported from Cucumber.
 * Instead they are imported as:
 * const { Given, When, Then } = createBdd(test, { worldFixture: 'world' });
 */
const getLocationInFile_1 = require("../../playwright/getLocationInFile");
const stepRegistry_1 = require("../stepRegistry");
const shared_1 = require("./shared");
function cucumberStepCtor(keyword, { customTest, worldFixture, defaultTags }) {
    return (...args) => {
        const { pattern, providedOptions, fn } = (0, shared_1.parseStepDefinitionArgs)(args);
        (0, stepRegistry_1.registerStepDefinition)({
            keyword,
            pattern,
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
            customTest,
            worldFixture,
            defaultTags,
            providedOptions,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fn: ({ $bddContext }, ...args) => {
                return fn.call($bddContext.world, ...args);
            },
        });
        // returns function to be able to reuse this fn in other steps
        // see: https://github.com/vitalets/playwright-bdd/issues/110
        // Note: for cucumber style we should call this fn with current world
        // e.g.: fn.call(this, ...args)
        return fn;
    };
}
//# sourceMappingURL=cucumberStyle.js.map