import BaseReporter, { InternalOptions, SkipAttachments } from './base';
type MessageReporterOptions = {
    outputFile?: string;
    skipAttachments?: SkipAttachments;
};
export default class MessageReporter extends BaseReporter {
    protected userOptions: MessageReporterOptions;
    constructor(internalOptions: InternalOptions, userOptions?: MessageReporterOptions);
}
export {};
//# sourceMappingURL=message.d.ts.map