/**
 * Base reporter for Cucumber reporters.
 * Reference: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/index.ts
 */
/// <reference types="node" />
/// <reference types="node" />
import { Writable } from 'node:stream';
import { EventEmitter } from 'node:events';
import * as messages from '@cucumber/messages';
import EventDataCollector from '../../cucumber/formatter/EventDataCollector.js';
export type InternalOptions = {
    cwd: string;
    eventBroadcaster: EventEmitter;
    eventDataCollector: EventDataCollector;
};
export type SkipAttachments = boolean | ('image/png' | 'video/webm' | 'application/zip' | string)[];
export default class BaseReporter {
    protected internalOptions: InternalOptions;
    protected outputStream: Writable;
    constructor(internalOptions: InternalOptions);
    get eventBroadcaster(): EventEmitter;
    get eventDataCollector(): EventDataCollector;
    printsToStdio(): boolean;
    init(): Promise<void>;
    finished(): Promise<void>;
    protected setOutputStream(outputFile?: string): void;
}
export declare function isAttachmentAllowed(envelope: messages.Envelope, skipAttachments?: SkipAttachments): boolean;
//# sourceMappingURL=base.d.ts.map