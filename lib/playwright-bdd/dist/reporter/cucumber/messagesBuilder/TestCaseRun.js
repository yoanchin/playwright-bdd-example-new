"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseRun = void 0;
const TestStepRun_1 = require("./TestStepRun");
const timing_1 = require("./timing");
const pwStepUtils_1 = require("./pwStepUtils");
const AttachmentMapper_1 = require("./AttachmentMapper");
const TestCaseRunHooks_1 = require("./TestCaseRunHooks");
const Projects_1 = require("./Projects");
class TestCaseRun {
    // eslint-disable-next-line max-params
    constructor(bddTestData, featureUri, test, result, hooks) {
        this.bddTestData = bddTestData;
        this.featureUri = featureUri;
        this.test = test;
        this.result = result;
        this.hooks = hooks;
        // Collect steps with error and show only these errors in report,
        // it allows to not show the same error of parent steps.
        // Usually, value contains step.error, but can be customized:
        // e.g. timeouted step may not have 'error' field.
        this.errorSteps = new Map();
        // root bg steps (can be several for Rules)
        this.bgRoots = new Set();
        this.id = this.generateTestRunId();
        this.projectInfo = (0, Projects_1.getProjectInfo)(this.test);
        // call order is important here
        this.attachmentMapper = new AttachmentMapper_1.AttachmentMapper(this.result);
        this.executedBddSteps = this.fillExecutedBddSteps();
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
    getStepError(pwStep) {
        return this.errorSteps.get(pwStep);
    }
    generateTestRunId() {
        return `${this.test.id}-attempt-${this.result.retry}`;
    }
    fillExecutedBddSteps() {
        const possiblePwSteps = this.getPossiblePwSteps();
        return this.bddTestData.steps.map((bddStep) => {
            return this.fillExecutedBddStep(bddStep, possiblePwSteps);
        });
    }
    // eslint-disable-next-line visual/complexity
    fillExecutedBddStep(bddStep, possiblePwSteps) {
        const pwStep = this.findPlaywrightStep(possiblePwSteps, bddStep);
        if (pwStep?.error) {
            this.registerErrorStep(pwStep, pwStep.error);
        }
        if (this.isTimeouted() && pwStep && (0, pwStepUtils_1.isUnknownDuration)(pwStep)) {
            this.registerTimeoutedStep(pwStep);
        }
        if (pwStep?.parent && bddStep.isBg) {
            this.bgRoots.add(pwStep.parent);
        }
        if (pwStep) {
            this.attachmentMapper.populateStepAttachments(pwStep);
        }
        return { bddStep, pwStep };
    }
    fillExecutedHooks(hookType) {
        return new TestCaseRunHooks_1.TestCaseRunHooks(this, hookType, this.bgRoots).fill();
    }
    registerErrorStep(pwStep, error) {
        this.errorSteps.set(pwStep, error);
    }
    hasRegisteredError(error) {
        for (const registeredError of this.errorSteps.values()) {
            if ((0, pwStepUtils_1.areTestErrorsEqual)(registeredError, error))
                return true;
        }
    }
    registerTimeoutedStep(pwStep) {
        if (this.timeoutedStep)
            return;
        this.timeoutedStep = pwStep;
        // Handle case when timeouted step has duration -1 and no 'error' field,
        // but it's parent contains actual error.
        // - timeout in bg step
        // - timeout in hooks
        // We register timeouted step with error from parent.
        if (!pwStep.error && pwStep.parent?.error && !(0, pwStepUtils_1.isTopLevelStep)(pwStep)) {
            this.registerErrorStep(this.timeoutedStep, pwStep.parent.error);
        }
    }
    getUnprocessedErrors() {
        return this.result.errors.filter((error) => !this.isProcessedError(error));
    }
    isProcessedError(error) {
        for (const pwStepError of this.errorSteps.values()) {
            if ((0, pwStepUtils_1.areTestErrorsEqual)(pwStepError, error)) {
                return true;
            }
        }
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
            .getSteps()
            .reduce((messages, testStep, stepIndex) => {
            const { pwStep } = this.executedBddSteps[stepIndex] || {};
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
    findPlaywrightStep(possiblePwSteps, bddStep) {
        return possiblePwSteps.find((pwStep) => {
            // todo: filter by file earlier?
            return (pwStep.location?.file === this.test.location.file &&
                pwStep.location?.line === bddStep.pwStepLine);
        });
    }
    getPossiblePwSteps() {
        // Before we collected only top-level steps and steps from before hooks (as they are background)
        // But it's more reliable to just collect all test.step items b/c some Playwright versions
        // move steps to fixtures (see: https://github.com/microsoft/playwright/issues/30075)
        // Collecting all test.step items should be ok, as later we anyway map them by location.
        return (0, pwStepUtils_1.walkSteps)(this.result.steps).filter((pwStep) => pwStep.category === 'test.step');
    }
}
exports.TestCaseRun = TestCaseRun;
//# sourceMappingURL=TestCaseRun.js.map