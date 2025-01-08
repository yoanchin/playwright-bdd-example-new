"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseRun = void 0;
const index_js_1 = require("../../../utils/index.js");
const TestStepRun_1 = require("./TestStepRun");
const timing_1 = require("./timing");
const pwStepUtils_1 = require("./pwStepUtils");
const AttachmentMapper_1 = require("./AttachmentMapper");
const TestCaseRunHooks_1 = require("./TestCaseRunHooks");
const Projects_1 = require("./Projects");
const index_js_2 = require("../../../run/bddAnnotation/index.js");
class TestCaseRun {
    constructor(test, result, hooks) {
        this.test = test;
        this.result = result;
        this.hooks = hooks;
        // collect steps with error and show only these errors in report.
        // it allows to not show the same error on parent steps
        this.errorSteps = new Set();
        this.id = this.generateTestRunId();
        this.bddData = this.extractBddData();
        this.projectInfo = (0, Projects_1.getProjectInfo)(this.test);
        this.attachmentMapper = new AttachmentMapper_1.AttachmentMapper(this.result);
        this.executedSteps = this.fillExecutedSteps();
        this.executedBeforeHooks = this.fillExecutedHooks('before');
        this.executedAfterHooks = this.fillExecutedHooks('after');
    }
    getTestCase() {
        if (!this.testCase)
            throw new Error(`TestCase is not set.`);
        return this.testCase;
    }
    isTimeouted() {
        return this.result.status === 'timedOut';
    }
    generateTestRunId() {
        return `${this.test.id}-attempt-${this.result.retry}`;
    }
    extractBddData() {
        const { bddData } = (0, index_js_2.getBddDataFromTest)(this.test);
        if (!bddData) {
            throw new Error(`__bddData annotation is not found for test "${this.test.title}".`);
        }
        // We could delete __bddData annotation here to hide it from other reporters,
        // but it leads to errors on Win.
        // Better way is to get some official way to pass custom data to reporters,
        // see: https://github.com/microsoft/playwright/issues/30179
        // this.test.annotations.splice(annotationIndex, 1);
        return bddData;
    }
    fillExecutedSteps() {
        const possiblePwSteps = this.getPossiblePlaywrightBddSteps();
        return this.bddData.steps.map((bddDataStep) => {
            const pwStep = this.findPlaywrightStep(possiblePwSteps, bddDataStep);
            this.registerErrorStep(pwStep);
            this.registerTimeoutedStep(pwStep);
            return { bddDataStep, pwStep };
        });
    }
    fillExecutedHooks(hookType) {
        return new TestCaseRunHooks_1.TestCaseRunHooks(this, hookType).fill(this.executedSteps);
    }
    registerErrorStep(pwStep) {
        if (pwStep?.error)
            this.errorSteps.add(pwStep);
    }
    // eslint-disable-next-line visual/complexity
    registerTimeoutedStep(pwStep) {
        if (!pwStep || !this.isTimeouted() || this.timeoutedStep)
            return;
        const { error } = pwStep;
        if ((0, pwStepUtils_1.isUnknownDuration)(pwStep) || this.result.errors.some((e) => e.message === error?.message)) {
            this.timeoutedStep = pwStep;
        }
    }
    buildMessages() {
        return [
            this.buildTestCaseStarted(),
            ...this.executedBeforeHooks.buildMessages(),
            ...this.buildStepRuns(),
            ...this.executedAfterHooks.buildMessages(),
            this.buildTestCaseFinished(),
        ];
    }
    getExecutedHooks(hookType) {
        return hookType === 'before'
            ? this.executedBeforeHooks.executedHooks
            : this.executedAfterHooks.executedHooks;
    }
    buildTestCaseStarted() {
        const testCaseStarted = {
            id: this.id,
            attempt: this.result.retry,
            testCaseId: this.getTestCase().id,
            // workerId: 'worker-1'
            timestamp: (0, timing_1.toCucumberTimestamp)(this.result.startTime.getTime()),
        };
        return { testCaseStarted };
    }
    buildStepRuns() {
        return this.getTestCase()
            .getMainSteps()
            .reduce((messages, testStep, stepIndex) => {
            const { pwStep } = this.executedSteps[stepIndex] || {};
            const testStepRun = new TestStepRun_1.TestStepRun(this, testStep, pwStep);
            return messages.concat(testStepRun.buildMessages());
        }, []);
    }
    buildTestCaseFinished() {
        const { startTime, duration } = this.result;
        const testCaseFinished = {
            testCaseStartedId: this.id,
            willBeRetried: Boolean(this.result.error && this.result.retry < this.test.retries),
            timestamp: (0, timing_1.toCucumberTimestamp)(startTime.getTime() + duration),
        };
        return { testCaseFinished };
    }
    findPlaywrightStep(possiblePwSteps, bddDataStep) {
        return possiblePwSteps.find((pwStep) => {
            return pwStep.location && (0, index_js_1.stringifyLocation)(pwStep.location) === bddDataStep.pwStepLocation;
        });
    }
    getPossiblePlaywrightBddSteps() {
        // Before we collected only top-level steps and steps from before hooks (as they are background)
        // But it's more reliable to just collect all test.step items b/c some Playwright versions
        // move steps to fixtures (see: https://github.com/microsoft/playwright/issues/30075)
        // Collecting all test.step items should be ok, as later we anyway map them by location.
        return (0, pwStepUtils_1.collectStepsWithCategory)(this.result, 'test.step');
    }
}
exports.TestCaseRun = TestCaseRun;
//# sourceMappingURL=TestCaseRun.js.map