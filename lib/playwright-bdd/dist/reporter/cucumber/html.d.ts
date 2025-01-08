import BaseReporter, { InternalOptions, SkipAttachments } from './base';
type HtmlReporterOptions = {
    outputFile?: string;
    skipAttachments?: SkipAttachments;
};
export default class HtmlReporter extends BaseReporter {
    protected userOptions: HtmlReporterOptions;
    private htmlStream;
    constructor(internalOptions: InternalOptions, userOptions?: HtmlReporterOptions);
    finished(): Promise<void>;
}
export {};
//# sourceMappingURL=html.d.ts.map