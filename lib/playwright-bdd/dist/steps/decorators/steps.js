"use strict";
/**
 * Define steps via decorators.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStepDecorator = createStepDecorator;
exports.linkStepsWithPomNode = linkStepsWithPomNode;
const bddTestFixturesAuto_1 = require("../../runtime/bddTestFixturesAuto");
const getLocationInFile_1 = require("../../playwright/getLocationInFile");
const stepRegistry_1 = require("../stepRegistry");
// initially we store step data inside method,
// and then extract it in @Fixture decorator call
const decoratedStepSymbol = Symbol('decoratedStep');
/**
 * Creates @Given, @When, @Then decorators.
 */
function createStepDecorator(keyword) {
    return (pattern, providedOptions) => {
        // offset = 3 b/c this call is 3 steps below the user's code
        const location = (0, getLocationInFile_1.getLocationByOffset)(3);
        // context parameter is required for decorator by TS even though it's not used
        return (method, _context) => {
            saveStepConfigToMethod(method, {
                keyword,
                pattern,
                location,
                providedOptions,
                fn: method,
            });
        };
    };
}
function linkStepsWithPomNode(Ctor, pomNode) {
    if (!Ctor?.prototype)
        return;
    const propertyDescriptors = Object.getOwnPropertyDescriptors(Ctor.prototype);
    return Object.values(propertyDescriptors).forEach((descriptor) => {
        const stepOptions = getStepOptionsFromMethod(descriptor);
        if (!stepOptions)
            return;
        stepOptions.pomNode = pomNode;
        stepOptions.defaultTags = pomNode.fixtureTags;
        registerDecoratorStep(stepOptions);
    });
}
// todo: link decorator steps with customTest!
function registerDecoratorStep(stepOptions) {
    const { fn } = stepOptions;
    (0, stepRegistry_1.registerStepDefinition)({
        ...stepOptions,
        fn: (fixturesArg, ...args) => {
            const pomFixture = getFirstNonAutoInjectFixture(fixturesArg, stepOptions);
            return fn.call(pomFixture, ...args);
        },
    });
}
function getFirstNonAutoInjectFixture(fixturesArg, { pattern }) {
    // there should be exactly one suitable fixture in fixturesArg
    const fixtureNames = Object.keys(fixturesArg).filter((fixtureName) => !(0, bddTestFixturesAuto_1.isBddAutoInjectFixture)(fixtureName));
    if (fixtureNames.length === 0) {
        throw new Error(`No suitable fixtures found for decorator step "${pattern}"`);
    }
    if (fixtureNames.length > 1) {
        throw new Error(`Several suitable fixtures found for decorator step "${pattern}"`);
    }
    return fixturesArg[fixtureNames[0]];
}
function saveStepConfigToMethod(method, stepConfig) {
    method[decoratedStepSymbol] = stepConfig;
}
function getStepOptionsFromMethod(descriptor) {
    // filter out getters / setters
    return typeof descriptor.value === 'function'
        ? descriptor.value[decoratedStepSymbol]
        : undefined;
}
//# sourceMappingURL=steps.js.map