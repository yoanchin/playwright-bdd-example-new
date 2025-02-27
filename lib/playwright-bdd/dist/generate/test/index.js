"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGen = void 0;
const finder_1 = require("../../steps/finder");
const i18n_1 = require("../i18n");
const helpers_1 = require("../../features/helpers");
const utils_1 = require("../../utils");
const exit_1 = require("../../utils/exit");
const fixtureParameterNames_1 = require("../../playwright/fixtureParameterNames");
const bddTestFixturesAuto_1 = require("../../runtime/bddTestFixturesAuto");
const specialTags_1 = require("../specialTags");
const decoratorFixtureResolver_1 = require("./decoratorFixtureResolver");
// todo: class StepGen ?
/**
 * Generates steps for a single scenario (test) and updates background steps.
 */
class TestGen {
    // eslint-disable-next-line max-params
    constructor(config, featureUri, i18nKeywordsMap, stepFinder, formatter, backgrounds, pickle, testTitle, scenarioSteps, tags, // all tags of test (including tags from path)
    ownTestTags) {
        this.config = config;
        this.featureUri = featureUri;
        this.i18nKeywordsMap = i18nKeywordsMap;
        this.stepFinder = stepFinder;
        this.formatter = formatter;
        this.backgrounds = backgrounds;
        this.pickle = pickle;
        this.testTitle = testTitle;
        this.scenarioSteps = scenarioSteps;
        this.tags = tags;
        this.stepsData = new Map();
        this.skippedByMissingSteps = false;
        this.specialTags = new specialTags_1.SpecialTags(ownTestTags);
        this.skippedByTag = (0, specialTags_1.isTestSkippedByCollectedTags)(this.tags);
        this.slow = (0, specialTags_1.isTestSlowByCollectedTags)(this.tags);
        this.fillStepsData();
        this.resolveFixtureNamesForDecoratorSteps();
    }
    get ownTimeout() {
        return this.specialTags.timeout;
    }
    get skipped() {
        return this.skippedByTag || this.skippedByMissingSteps;
    }
    render() {
        const testFixtureNames = [];
        const stepLines = [...this.stepsData.values()]
            .filter((stepData) => this.scenarioSteps.includes(stepData.gherkinStep))
            .map((stepData) => {
            const { pickleStep, gherkinStep, fixtureNames } = stepData;
            const keywordEng = (0, i18n_1.getKeywordEng)(this.i18nKeywordsMap, gherkinStep.keyword);
            const pickleStepIds = [pickleStep.id];
            testFixtureNames.push(keywordEng, ...fixtureNames);
            return this.formatter.step(keywordEng, pickleStep.text, pickleStep.argument, new Set(fixtureNames), pickleStepIds);
        });
        this.handleMissingDefinitions();
        return this.formatter.test(this.testTitle, this.tags, this.specialTags, new Set(testFixtureNames), this.pickle.id, stepLines);
    }
    fillStepsData() {
        this.pickle.steps.forEach((pickleStep) => {
            const { gherkinStep, bg } = this.findGherkinStep(pickleStep);
            const location = `${this.featureUri}:${(0, utils_1.stringifyLocation)(gherkinStep.location)}`;
            const matchedDefinition = this.findMatchedDefinition(pickleStep, gherkinStep);
            const fixtureNames = this.getStepFixtureNames(matchedDefinition);
            const pomNode = matchedDefinition?.definition.pomNode;
            const stepData = {
                pickleStep,
                gherkinStep,
                location,
                matchedDefinition,
                fixtureNames,
                pomNode,
                isBg: Boolean(bg),
            };
            this.stepsData.set(pickleStep.id, stepData);
            bg?.addStepData(stepData);
        });
    }
    handleMissingDefinitions() {
        if (!this.skippedByTag &&
            this.hasMissingDefinitions() &&
            this.config.missingSteps === 'skip-scenario') {
            this.skippedByMissingSteps = true;
            this.specialTags.forceFixme();
        }
    }
    findGherkinStep(pickleStep) {
        const { bg, bgGherkinStep } = this.findBackgroundStep(pickleStep) || {};
        const gherkinStep = bgGherkinStep || this.findScenarioStep(pickleStep);
        if (!gherkinStep)
            (0, exit_1.exit)(`Gherkin step not found for pickle step: ${pickleStep.text}`);
        return { gherkinStep, bg };
    }
    findBackgroundStep(pickleStep) {
        for (const bg of this.backgrounds) {
            const bgGherkinStep = bg.findGherkinStep(pickleStep);
            if (bgGherkinStep)
                return { bg, bgGherkinStep };
        }
    }
    findScenarioStep(pickleStep) {
        return this.scenarioSteps.find(({ id }) => pickleStep.astNodeIds.includes(id));
    }
    hasMissingDefinitions() {
        return [...this.stepsData.values()].some((stepData) => !stepData.matchedDefinition);
    }
    findMatchedDefinition(pickleStep, gherkinStep) {
        // for skipped tests don't search for definition
        if (this.skipped)
            return;
        const matchedDefinitions = this.stepFinder.findDefinitions(pickleStep.type, pickleStep.text, this.tags);
        if (matchedDefinitions.length === 0)
            return;
        if (matchedDefinitions.length > 1) {
            const stepTextWithKeyword = (0, helpers_1.getStepTextWithKeyword)(gherkinStep.keyword, pickleStep.text);
            const stepLocation = `${this.featureUri}:${(0, utils_1.stringifyLocation)(gherkinStep.location)}`;
            // exit immediately, b/c with multiple step definitions we can't proceed
            (0, exit_1.exit)((0, finder_1.formatDuplicateStepsMessage)(matchedDefinitions, stepTextWithKeyword, stepLocation));
        }
        return matchedDefinitions[0];
    }
    resolveFixtureNamesForDecoratorSteps() {
        new decoratorFixtureResolver_1.DecoratorFixtureResolver(this.config, this.tags).resolveFixtureNames(this.stepsData);
    }
    getStepFixtureNames(matchedDefinition) {
        if (!matchedDefinition)
            return [];
        const { definition } = matchedDefinition;
        // for decorator steps fixture names are resolved later,
        // when all steps are collected
        if (definition.isDecorator())
            return [];
        // for cucumber-style there is no fixtures arg,
        // fixtures are accessible via this.world
        if (definition.isCucumberStyle())
            return [];
        return (0, fixtureParameterNames_1.fixtureParameterNames)(definition.fn) // prettier-ignore
            .filter((name) => !(0, bddTestFixturesAuto_1.isBddAutoInjectFixture)(name));
    }
}
exports.TestGen = TestGen;
//# sourceMappingURL=index.js.map