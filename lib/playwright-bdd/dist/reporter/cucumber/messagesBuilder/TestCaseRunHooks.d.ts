/**
 * Executed hooks of test run.
 *
 * In Playwright:
 * worker-level hooks (BeforeAll / AfterAll) are still part of
 * particular test results. E.g. BeforeAll is reported as a step of the first test in a worker.
 *
 * In Cucumber:
 * Worker-level hooks are not considered to be a part of any test case.
 * They will be reported as separate messages TestRunHookStarted / TestRunHookFinished.
 * See: https://github.com/cucumber/messages/pull/102
 *
 * In playwright-bdd:
 * As of now, we don't emit TestRunHookStarted / TestRunHookFinished messages,
 * but include worker-level hooks into testCase steps.
 * This could be changed in the future, when cucumber-js will add it.
 */
import * as pw from '@playwright/test/reporter';
import { Hook, HooksGroup } from './Hook';
import { TestCaseRun } from './TestCaseRun';
import { TestStepRunEnvelope } from './TestStepRun';
type ExecutedHookInfo = {
    hook: Hook;
    pwStep: pw.TestStep;
};
export declare function isHookCandidate(pwStep: pw.TestStep): boolean;
export declare class TestCaseRunHooks {
    private testCaseRun;
    private hookType;
    private bgRoots;
    private rootPwStep;
    private candidates;
    private hookPwSteps;
    executedHooks: Map<string, ExecutedHookInfo>;
    static getRootPwStep(result: TestCaseRun, hookType: HooksGroup): pw.TestStep | undefined;
    constructor(testCaseRun: TestCaseRun, hookType: HooksGroup, bgRoots: Set<pw.TestStep>);
    private get isAfterHooksType();
    fill(): this;
    buildMessages(): TestStepRunEnvelope[];
    private setRootPwStep;
    private setCandidates;
    private addStepsWithName;
    private addStepWithTimeout;
    private addStepWithError;
    /**
     * If there are unprocessed errors, attach them to After Hooks root step.
     */
    private addUnprocessedErrors;
    private addStepsWithAttachment;
    private addUnprocessedAttachments;
    private setExecutedHooks;
    private getOrRegisterHook;
    private registerErrorStep;
}
export {};
//# sourceMappingURL=TestCaseRunHooks.d.ts.map