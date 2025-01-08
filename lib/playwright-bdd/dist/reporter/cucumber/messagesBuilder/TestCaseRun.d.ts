/**
 * Class representing single run of a test case.
 */
import * as pw from '@playwright/test/reporter';
import * as messages from '@cucumber/messages';
import { Hook, HookType } from './Hook';
import { TestCase } from './TestCase';
import { AutofillMap } from '../../../utils/AutofillMap.js';
import { TestStepRunEnvelope } from './TestStepRun';
import { AttachmentMapper } from './AttachmentMapper';
import { ProjectInfo } from './Projects';
import { BddData, BddDataStep } from '../../../run/bddAnnotation/types.js';
export type TestCaseRunEnvelope = TestStepRunEnvelope & Pick<messages.Envelope, 'testCaseStarted' | 'testCaseFinished'>;
export type ExecutedStepInfo = {
    bddDataStep: BddDataStep;
    pwStep?: pw.TestStep;
};
export declare class TestCaseRun {
    test: pw.TestCase;
    result: pw.TestResult;
    hooks: AutofillMap<string, Hook>;
    id: string;
    bddData: BddData;
    testCase?: TestCase;
    attachmentMapper: AttachmentMapper;
    projectInfo: ProjectInfo;
    errorSteps: Set<pw.TestStep>;
    timeoutedStep?: pw.TestStep;
    private executedBeforeHooks;
    private executedAfterHooks;
    private executedSteps;
    constructor(test: pw.TestCase, result: pw.TestResult, hooks: AutofillMap<string, Hook>);
    getTestCase(): TestCase;
    isTimeouted(): boolean;
    private generateTestRunId;
    private extractBddData;
    private fillExecutedSteps;
    private fillExecutedHooks;
    registerErrorStep(pwStep?: pw.TestStep): void;
    registerTimeoutedStep(pwStep?: pw.TestStep): void;
    buildMessages(): (TestStepRunEnvelope | {
        testCaseStarted: messages.TestCaseStarted;
    } | {
        testCaseFinished: messages.TestCaseFinished;
    })[];
    getExecutedHooks(hookType: HookType): Map<string, {
        hook: Hook;
        pwStep: pw.TestStep;
    }>;
    private buildTestCaseStarted;
    private buildStepRuns;
    private buildTestCaseFinished;
    private findPlaywrightStep;
    private getPossiblePlaywrightBddSteps;
}
//# sourceMappingURL=TestCaseRun.d.ts.map