import { GherkinDocumentWithPickles } from '../../../features/types';
export declare class GherkinDocumentClone {
    private gherkinDocument;
    private oldNewIds;
    constructor(gherkinDocument: GherkinDocumentWithPickles);
    getClone(): GherkinDocumentWithPickles;
    private getDocumentCopyWithNewIds;
    private remapPickleAstNodeIds;
    private remapPickleStepsAstNodeIds;
    private getOrGenerateNewId;
    private getNewId;
}
//# sourceMappingURL=GherkinDocumentClone.d.ts.map