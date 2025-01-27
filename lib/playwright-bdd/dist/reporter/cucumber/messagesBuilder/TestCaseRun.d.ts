/**
 * Class representing single run of a test case.
 */
import * as pw from '@playwright/test/reporter';
import * as messages from '@cucumber/messages';
import { Hook, HooksGroup } from './Hook';
import { TestCase } from './TestCase';
import { AutofillMap } from '../../../utils/AutofillMap.js';
import { TestStepRunEnvelope } from './TestStepRun';
import { AttachmentMapper } from './AttachmentMapper';
import { ProjectInfo } from './Projects';
import { BddTestData } from '../../../bddData/types';
export type TestCaseRunEnvelope = TestStepRunEnvelope & Pick<messages.Envelope, 'testCaseStarted' | 'testCaseFinished'>;
export declare class TestCaseRun {
    bddTestData: BddTestData;
    featureUri: string;
    test: pw.TestCase;
    result: pw.TestResult;
    hooks: AutofillMap<string, Hook>;
    id: string;
    testCase?: TestCase;
    attachmentMapper: AttachmentMapper;
    projectInfo: ProjectInfo;
    errorSteps: Map<pw.TestStep, pw.TestError>;
    timeoutedStep?: pw.TestStep;
    private executedBeforeHooks;
    private executedAfterHooks;
    private executedBddSteps;
    private bgRoots;
    constructor(bddTestData: BddTestData, featureUri: string, test: pw.TestCase, result: pw.TestResult, hooks: AutofillMap<string, Hook>);
    getTestCase(): TestCase;
    isTimeouted(): boolean;
    buildMessages(): (TestStepRunEnvelope | {
        testCaseStarted: messages.TestCaseStarted;
    } | {
        testCaseFinished: messages.TestCaseFinished;
    })[];
    getExecutedHooks(hookType: HooksGroup): Map<string, {
        hook: Hook;
        pwStep: pw.TestStep;
    }>;
    getStepError(pwStep: pw.TestStep): pw.TestError | undefined;
    private generateTestRunId;
    private fillExecutedBddSteps;
    private fillExecutedBddStep;
    private fillExecutedHooks;
    registerErrorStep(pwStep: pw.TestStep, error: pw.TestError): void;
    hasRegisteredError(error: pw.TestError): true | undefined;
    registerTimeoutedStep(pwStep: pw.TestStep): void;
    getUnprocessedErrors(): pw.TestError[];
    private isProcessedError;
    private buildTestCaseStarted;
    private buildStepRuns;
    private buildTestCaseFinished;
    private findPlaywrightStep;
    private getPossiblePwSteps;
}
//# sourceMappingURL=TestCaseRun.d.ts.map