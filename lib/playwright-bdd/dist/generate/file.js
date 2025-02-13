"use strict";
/**
 * Generate Playwright test file for feature.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const formatter_1 = require("./formatter");
const i18n_1 = require("./i18n");
const lang_1 = require("../config/lang");
const importTest_1 = require("./importTest");
const documentQuery_1 = require("../features/documentQuery");
const examplesTitleBuilder_1 = require("./examplesTitleBuilder");
const helpers_1 = require("../features/helpers");
const finder_1 = require("../steps/finder");
const exit_1 = require("../utils/exit");
const String_1 = require("../utils/String");
const hooks_1 = require("./hooks");
const paths_1 = require("./paths");
const specialTags_1 = require("./specialTags");
const background_1 = require("./background");
const test_1 = require("./test");
const sourceMapper_1 = require("./sourceMapper");
const renderer_1 = require("../bddData/renderer");
const tags_1 = require("../steps/tags");
const utils_1 = require("../utils");
class TestFile {
    constructor(options) {
        this.options = options;
        this.lines = [];
        this.backgrounds = [];
        this.tests = [];
        this.outputPath = (0, paths_1.getSpecFileByFeatureFile)(this.config, this.featureUri);
        this.formatter = new formatter_1.Formatter(options.config);
        this.gherkinDocumentQuery = new documentQuery_1.GherkinDocumentQuery(this.gherkinDocument);
        this.stepFinder = new finder_1.StepFinder(options.config);
        this.hooks = new hooks_1.TestFileHooks(this.formatter);
        this.tagsFromPath = (0, tags_1.extractTagsFromPath)(this.featureUri);
    }
    get gherkinDocument() {
        return this.options.gherkinDocument;
    }
    /**
     * Returns to feature file, relative to configDir.
     * Separator is OS-specific (/ on Unix, \ on Windows).
     */
    get featureUri() {
        return this.gherkinDocument.uri;
    }
    get pickles() {
        return this.gherkinDocument.pickles;
    }
    get content() {
        return this.lines.join('\n');
    }
    get language() {
        return this.gherkinDocument.feature?.language || lang_1.LANG_EN;
    }
    get isEnglish() {
        return (0, lang_1.isEnglish)(this.language);
    }
    get config() {
        return this.options.config;
    }
    hasExecutableTests() {
        return this.tests.some((test) => !test.skippedByTag);
    }
    build() {
        if (!this.gherkinDocumentQuery.hasPickles())
            return this;
        this.loadI18nKeywords();
        // important to calc suites first, b/c file header depends on used steps and used tags
        const suites = this.renderRootSuite();
        this.hooks.fillFromTests(this.tests);
        // todo: use lines instead of this.lines,
        // and pass them to updateTestLocations() explicitly
        this.lines = [
            ...this.renderFileHeader(), // prettier-ignore
            ...suites,
        ];
        this.renderInplaceBackgrounds();
        this.lines.push(...this.renderTechnicalSection());
        return this;
    }
    /**
     * Collect missing steps for all tests in the feature file.
     */
    getMissingSteps() {
        return (this.tests
            // if user skipped scenario manually, don't report missing steps
            .filter((test) => !test.skippedByTag)
            .reduce((acc, test) => {
            test.stepsData.forEach((stepData) => {
                if (!stepData.matchedDefinition)
                    acc.push(stepData);
            });
            return acc;
        }, []));
    }
    getUsedDefinitions() {
        const usedDefinitions = new Set();
        this.tests.forEach((test) => {
            test.stepsData.forEach(({ matchedDefinition }) => {
                if (matchedDefinition)
                    usedDefinitions.add(matchedDefinition.definition);
            });
        });
        return usedDefinitions;
    }
    renderFileHeader() {
        const importTestFrom = this.resolveImportTestFrom();
        return this.formatter.fileHeader(this.featureUri, importTestFrom);
    }
    loadI18nKeywords() {
        if (!this.isEnglish) {
            this.i18nKeywordsMap = (0, i18n_1.getKeywordsMap)(this.language);
        }
    }
    renderTechnicalSection() {
        const worldFixtureName = this.getWorldFixtureName();
        const sourceMapper = new sourceMapper_1.SourceMapper(this.lines);
        const bddDataRenderer = new renderer_1.BddDataRenderer(this.tests, sourceMapper);
        const testUse = this.formatter.testUse([
            ...this.formatter.testFixture(),
            ...this.formatter.uriFixture(this.featureUri),
            ...bddDataRenderer.renderFixture(),
            ...this.formatter.scenarioHooksFixtures('before', this.hooks.before.getFixtureNames()),
            ...this.formatter.scenarioHooksFixtures('after', this.hooks.after.getFixtureNames()),
            ...(worldFixtureName ? this.formatter.worldFixture(worldFixtureName) : []),
        ]);
        return [
            '// == technical section ==', // prettier-ignore
            '',
            ...this.hooks.render(),
            ...testUse,
            '',
            ...bddDataRenderer.renderVariable(),
        ];
    }
    renderRootSuite() {
        const { feature } = this.gherkinDocument;
        if (!feature)
            throw new Error(`Document without feature.`);
        return this.renderDescribe(feature);
    }
    /**
     * Generate test.describe suite for Feature or Rule
     */
    renderDescribe(feature) {
        const specialTags = new specialTags_1.SpecialTags((0, helpers_1.getTagNames)(feature.tags));
        const lines = [];
        feature.children.forEach((child) => {
            lines.push(...this.renderChild(child));
        });
        return this.formatter.describe(feature.name, specialTags, lines);
    }
    // eslint-disable-next-line visual/complexity
    renderChild(child) {
        if ('rule' in child && child.rule)
            return this.renderDescribe(child.rule);
        if (child.background)
            return this.renderBackgroundPlaceholder(child.background);
        if (child.scenario)
            return (0, helpers_1.isScenarioOutline)(child.scenario) // prettier-ignore
                ? this.renderScenarioOutline(child.scenario)
                : this.renderScenario(child.scenario);
        throw new Error(`Empty child: ${JSON.stringify(child)}`);
    }
    renderBackgroundPlaceholder(bg) {
        const bgGen = new background_1.BackgroundGen(this.formatter, this.i18nKeywordsMap, bg);
        this.backgrounds.push(bgGen);
        return [bgGen.placeholder];
    }
    /**
     * Insert test.beforeEach for Backgrounds
     */
    renderInplaceBackgrounds() {
        this.backgrounds.forEach((bg) => bg.renderInplace(this.lines));
    }
    renderScenario(scenario) {
        const testTitle = scenario.name;
        const pickle = this.findPickle(scenario.id, testTitle);
        const ownTestTags = (0, helpers_1.getTagNames)(scenario.tags);
        return this.renderTest(pickle, testTitle, ownTestTags, scenario.steps);
    }
    /**
     * Generate test.describe suite for Scenario Outline
     */
    renderScenarioOutline(scenario) {
        const specialTags = new specialTags_1.SpecialTags((0, helpers_1.getTagNames)(scenario.tags));
        const examplesTitleBuilder = this.createExamplesTitleBuilder(scenario);
        const lines = [];
        scenario.examples.forEach((examples) => {
            examples.tableBody.forEach((exampleRow) => {
                const testTitle = (0, String_1.extractTestCaseIDFromFirstElement)((0, helpers_1.getTagNames)(scenario.tags)) + examplesTitleBuilder.buildTitle(examples, exampleRow);
                const pickle = this.findPickle(exampleRow.id, testTitle);
                const ownTestTags = (0, helpers_1.getTagNames)(examples.tags);
                const testLines = this.renderTest(pickle, testTitle, ownTestTags, scenario.steps);
                lines.push(...testLines);
            });
        });
        // don't render describe without tests
        if (!lines.length)
            return [];
        return this.formatter.describe(scenario.name, specialTags, lines);
    }
    /**
     * Render test for Scenario or Scenario Outline.
     */
    renderTest(pickle, testTitle, ownTestTags, gherkinSteps) {
        const testTags = (0, utils_1.removeDuplicates)([...this.tagsFromPath, ...(0, helpers_1.getTagNames)(pickle.tags)]);
        if (this.isSkippedByTagsExpression(testTags))
            return [];
        const test = new test_1.TestGen(this.config, this.featureUri, this.i18nKeywordsMap, this.stepFinder, this.formatter, this.backgrounds, pickle, testTitle, gherkinSteps, testTags, ownTestTags);
        this.tests.push(test);
        return test.render();
    }
    findPickle(astNodeId, testTitle) {
        const pickles = this.gherkinDocumentQuery.getPickles(astNodeId);
        if (pickles.length !== 1) {
            (0, exit_1.exit)(`Found ${pickles.length} pickle(s) for scenario: ${testTitle}`);
        }
        return pickles[0];
    }
    isSkippedByTagsExpression(tags) {
        // see: https://github.com/cucumber/tag-expressions/tree/main/javascript
        const { tagsExpression } = this.options;
        return tagsExpression && !tagsExpression.evaluate(tags);
    }
    getWorldFixtureName() {
        const worldFixtureNames = new Set();
        this.tests.forEach((test) => {
            test.stepsData.forEach(({ matchedDefinition }) => {
                if (matchedDefinition) {
                    const { worldFixture } = matchedDefinition.definition;
                    if (worldFixture)
                        worldFixtureNames.add(worldFixture);
                }
            });
        });
        this.hooks.getWorldFixtureNames().forEach((name) => worldFixtureNames.add(name));
        if (worldFixtureNames.size > 1) {
            throw new Error([
                `All steps and hooks in a feature file should have the same worldFixture.`,
                `Found fixtures: ${[...worldFixtureNames].join(', ')}`,
                `File: ${this.featureUri}`,
            ].join('\n'));
        }
        return [...worldFixtureNames][0];
    }
    createExamplesTitleBuilder(scenario) {
        return new examplesTitleBuilder_1.ExamplesTitleBuilder({
            config: this.config,
            gherkinDocument: this.gherkinDocument,
            isEnglish: this.isEnglish,
            scenario,
        });
    }
    resolveImportTestFrom() {
        let { importTestFrom } = this.config;
        if (!importTestFrom) {
            importTestFrom = new importTest_1.ImportTestGuesser(this.featureUri, this.getUsedDefinitions(), this.getUsedPomFixtures(), this.hooks.getCustomTestInstances()).guess();
        }
        if (!importTestFrom)
            return;
        const { file, varName } = importTestFrom;
        const dir = node_path_1.default.dirname(this.outputPath);
        return {
            file: node_path_1.default.relative(dir, file),
            varName,
        };
    }
    getUsedPomFixtures() {
        const usedPomFixtures = new Set();
        this.tests.forEach((test) => {
            test.stepsData.forEach(({ pomFixtureName }) => {
                if (pomFixtureName)
                    usedPomFixtures.add(pomFixtureName);
            });
        });
        return usedPomFixtures;
    }
}
exports.TestFile = TestFile;
//# sourceMappingURL=file.js.map