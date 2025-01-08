/// <reference types="node" />
/**
 * Builds cucumber messages from Playwright test results.
 */
import * as pw from '@playwright/test/reporter';
import EventEmitter from 'node:events';
import EventDataCollector from '../../../cucumber/formatter/EventDataCollector.js';
export declare class MessagesBuilder {
    private report;
    private fullConfig;
    private fullResult;
    private testCaseRuns;
    private testCases;
    private hooks;
    private gherkinDocuments;
    private fullResultTiming?;
    private onEndPromise;
    private onEndPromiseResolve;
    private buildMessagesPromise?;
    private eventDataCollectorEmitter;
    eventDataCollector: EventDataCollector;
    constructor();
    onBegin(config: pw.FullConfig): void;
    onTestEnd(test: pw.TestCase, result: pw.TestResult): void;
    onEnd(fullResult: pw.FullResult): void;
    /**
     * Builds Cucumber messages.
     * Note: wrapped into promise to build messages once for all reporters.
     */
    buildMessages(): Promise<void>;
    private doBuildMessages;
    emitMessages(eventBroadcaster: EventEmitter): void;
    private createTestCases;
    private loadFeatures;
    private addMeta;
    private addSourcesAndDocuments;
    private addPickles;
    private addHooks;
    private addTestCases;
    private addTestCaseRuns;
    private addTestRunStarted;
    private addTestRunFinished;
    private buildEventDataCollector;
    private getFullResultTiming;
}
//# sourceMappingURL=index.d.ts.map