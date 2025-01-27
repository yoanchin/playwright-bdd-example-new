"use strict";
/**
 * Helper to format Playwright test file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
exports.indent = indent;
exports.extractPickleIdFromLine = extractPickleIdFromLine;
exports.extractPickleStepIdsFromLine = extractPickleStepIdsFromLine;
const jsStringWrap_1 = require("../utils/jsStringWrap");
const utils_1 = require("../playwright/utils");
const paths_1 = require("../utils/paths");
const const_1 = require("../hooks/const");
const supportsTags = utils_1.playwrightVersion >= '1.42.0';
class Formatter {
    constructor(config) {
        this.config = config;
    }
    fileHeader(featureUri, importTestFrom) {
        // always use "/" for imports, see #91
        const importTestFromFile = (0, paths_1.toPosixPath)(importTestFrom?.file || 'playwright-bdd');
        let varName = importTestFrom?.varName || 'test';
        if (varName !== 'test')
            varName = `${varName} as test`;
        return [
            `// Generated from: ${featureUri}`, // prettier-ignore
            // this.quoted() is not possible for 'import from' as backticks not parsed
            `import { ${varName} } from ${JSON.stringify(importTestFromFile)};`,
            '',
        ];
    }
    describe(title, specialTags, children) {
        const titleStr = this.quoted(title);
        const fn = this.withSubFunction('describe', specialTags);
        const firstLine = `test.${fn}(${titleStr}, () => {`;
        if (!children.length)
            return [`${firstLine}});`, ''];
        return [
            firstLine, // prettier-ignore
            ...this.describeConfigure(specialTags).map(indent),
            ...this.markAsFailing(specialTags).map(indent),
            // we don't render test.slow() here, b/c each call of test.slow() multiplies timeout
            // that is not now tags are assumed to work
            '',
            ...children.map(indent),
            `});`,
            '',
        ];
    }
    beforeEach(title, fixtures, children) {
        const titleStr = title ? `${this.quoted(title)}, ` : '';
        const fixturesStr = [...fixtures].join(', ');
        return [
            `test.beforeEach(${titleStr}async ({ ${fixturesStr} }) => {`,
            ...children.map(indent),
            `});`,
            '',
        ];
    }
    scenarioHooksCall(type) {
        const title = type === 'before' ? const_1.BEFORE_EACH_HOOKS_GROUP_NAME : const_1.AFTER_EACH_HOOKS_GROUP_NAME;
        return [
            type === 'before'
                ? `test.beforeEach(${this.quoted(title)}, ({ $beforeEach }) => {});`
                : `test.afterEach(${this.quoted(title)}, ({ $afterEach }) => {});`,
        ];
    }
    workerHooksCall(type, fixturesNames, bddDataVar) {
        // For beforeAll we run hooks, but for afterAll just register, and run on worker teardown.
        const runWorkerHooksFixture = type === 'beforeAll' ? '$runBeforeAllHooks' : '$registerAfterAllHooks';
        const fixturesStr = [...fixturesNames].join(', ');
        const allFixturesStr = [runWorkerHooksFixture, ...fixturesNames].join(', ');
        const title = type === 'beforeAll' ? const_1.BEFORE_ALL_HOOKS_GROUP_NAME : const_1.AFTER_ALL_HOOKS_GROUP_NAME;
        return [
            // eslint-disable-next-line max-len
            `test.${type}(${this.quoted(title)}, ({ ${allFixturesStr} }) => ${runWorkerHooksFixture}(test, { ${fixturesStr} }, ${bddDataVar}));`,
        ];
    }
    // eslint-disable-next-line max-params
    test(title, tags, specialTags, fixtures, pickleId, children) {
        const titleStr = this.quoted(title);
        const tagsStr = this.testTags(tags);
        const fixturesStr = [...fixtures].join(', ');
        const fn = this.withSubFunction('test', specialTags);
        const firstLine = `${fn}(${titleStr}, ${tagsStr}async ({ ${fixturesStr} }) => { // test: ${pickleId}`;
        const lines = [
            firstLine, // prettier-ignore
            // We use test.fail() in the test body instead of test.fail('...', () => { ... })
            // It allows to apply .only() / .skip() on failing tests.
            // See: https://github.com/microsoft/playwright/issues/30662
            ...this.markAsFailing(specialTags).map(indent),
            ...children.map(indent),
            `});`,
            '',
        ];
        // Wrap test into anonymous describe in case of retries
        // See: https://github.com/microsoft/playwright/issues/10825
        return specialTags.retries !== undefined
            ? this.wrapInAnonymousDescribe([
                ...this.describeConfigure(specialTags).map(indent),
                '',
                ...lines.map(indent),
            ])
            : lines;
    }
    // eslint-disable-next-line max-params
    step(keywordEng, stepText, argument, fixtureNames, pickleStepIds) {
        const textArg = this.quoted(stepText);
        const fixtures = fixtureNames.size ? `{ ${[...fixtureNames].join(', ')} }` : '';
        const argumentArg = argument ? JSON.stringify(argument) : fixtures ? 'null' : '';
        const args = [textArg, argumentArg, fixtures].filter((arg) => arg !== '').join(', ');
        return `await ${keywordEng}(${args}); // step: ${pickleStepIds.join(',')}`;
    }
    /**
     * Renders test.use() call with fixtures.
     *
     * NOTE: don't generate worker-scoped fixtures in test file,
     * because it forces new worker creation.
     * See: https://github.com/microsoft/playwright/issues/33316
     */
    testUse(lines) {
        return ['test.use({', ...lines.map(indent), '});'];
    }
    worldFixture(worldFixtureName) {
        return [`$world: ({ ${worldFixtureName} }, use) => use(${worldFixtureName}),`];
    }
    testFixture() {
        return [`$test: ({}, use) => use(test),`];
    }
    uriFixture(featureUri) {
        return [`$uri: ({}, use) => use(${this.quoted(featureUri)}),`];
    }
    scenarioHooksFixtures(type, fixtureNames) {
        if (!fixtureNames.length)
            return [];
        const targetFixtureName = type === 'before' ? '$beforeEachFixtures' : '$afterEachFixtures';
        const fixturesStr = fixtureNames.join(', ');
        return [`${targetFixtureName}: ({ ${fixturesStr} }, use) => use({ ${fixturesStr} }),`];
    }
    withSubFunction(baseFn, specialTags) {
        if (specialTags.only)
            return `${baseFn}.only`;
        if (specialTags.skip)
            return `${baseFn}.skip`;
        if (specialTags.fixme)
            return `${baseFn}.fixme`;
        return baseFn;
    }
    describeConfigure({ retries, timeout, mode }) {
        const options = {};
        if (retries !== undefined)
            options.retries = retries;
        if (timeout !== undefined)
            options.timeout = timeout;
        if (mode !== undefined)
            options.mode = mode;
        return Object.keys(options).length
            ? [`test.describe.configure(${JSON.stringify(options)});`]
            : [];
    }
    wrapInAnonymousDescribe(lines) {
        return [
            'test.describe(() => {', // prettier-ignore
            ...lines,
            `});`,
            '',
        ];
    }
    markAsFailing(specialTags) {
        return specialTags.fail ? [`test.fail();`] : [];
    }
    testTags(tags) {
        return supportsTags && tags.length
            ? `{ tag: [${tags.map((tag) => this.quoted(tag)).join(', ')}] }, `
            : '';
    }
    /**
     * Apply this function only to string literals (mostly titles here).
     * Objects and arrays are handled with JSON.stringify,
     * b/c object keys can't be in backticks.
     * See: https://stackoverflow.com/questions/33194138/template-string-as-object-property-name
     */
    quoted(str) {
        return (0, jsStringWrap_1.jsStringWrap)(str, { quotes: this.config.quotes });
    }
}
exports.Formatter = Formatter;
function indent(value) {
    return value ? `${'  '}${value}` : value;
}
function extractPickleIdFromLine(line) {
    const match = line.match(/\/\/ test: ([0-9a-f-]+)$/);
    if (match) {
        return { pickleId: match[1], index: match.index };
    }
}
/**
 * Extracts pickle step IDs from the comment at the end of the line.
 * Note:
 * - we can't use line.endsWith(`// step: ${gherkinStep.id}`), because for Scenario Outline
 * the same step is rendered multiple times with different pickle step ids.
 * - we can't use line.endsWith(`// step: ${pickleStep.id}`), because for Background
 * the same step is referenced by multiple pickle steps.
 */
function extractPickleStepIdsFromLine(line) {
    const match = line.match(/\/\/ step: ([0-9a-f-,]+)$/);
    if (match) {
        return { pickleStepIds: match[1].split(','), index: match.index };
    }
}
//# sourceMappingURL=formatter.js.map