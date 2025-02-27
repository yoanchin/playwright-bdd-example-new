/**
 * Base reporter for Cucumber reporters.
 * Reference: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/index.ts
 */
import { Writable } from 'node:stream';
import { EventEmitter } from 'node:events';
import EventDataCollector from '../../cucumber/formatter/EventDataCollector.js';
export type InternalOptions = {
    cwd: string;
    eventBroadcaster: EventEmitter;
    eventDataCollector: EventDataCollector;
};
export default class BaseReporter {
    protected internalOptions: InternalOptions;
    protected outputStream: Writable;
    protected outputDir: string;
    constructor(internalOptions: InternalOptions);
    get eventBroadcaster(): EventEmitter;
    get eventDataCollector(): EventDataCollector;
    printsToStdio(): boolean;
    init(): Promise<void>;
    finished(): Promise<void>;
    protected setOutputStream(outputFile?: string): void;
}
//# sourceMappingURL=base.d.ts.map