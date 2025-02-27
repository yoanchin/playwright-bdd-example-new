"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GherkinDocumentClone = void 0;
/**
 * Creates gherkin document copy with re-generated ast node IDs,
 * pickle IDs and pickle steps IDs.
 */
const node_crypto_1 = require("node:crypto");
const AutofillMap_1 = require("../../../utils/AutofillMap");
class GherkinDocumentClone {
    constructor(gherkinDocument) {
        this.gherkinDocument = gherkinDocument;
        this.oldNewIds = new AutofillMap_1.AutofillMap();
    }
    getClone() {
        const copiedDoc = this.getDocumentCopyWithNewIds();
        this.remapPickleAstNodeIds(copiedDoc);
        return copiedDoc;
    }
    getDocumentCopyWithNewIds() {
        return JSON.parse(JSON.stringify(this.gherkinDocument, (key, value) => {
            return key === 'id' ? this.getOrGenerateNewId(value) : value;
        }));
    }
    remapPickleAstNodeIds(copiedDoc) {
        copiedDoc.pickles.forEach((pickle) => {
            pickle.astNodeIds = pickle.astNodeIds.map((oldId) => this.getNewId(oldId));
            this.remapPickleStepsAstNodeIds(pickle);
        });
    }
    remapPickleStepsAstNodeIds(pickle) {
        pickle.steps.forEach((step) => {
            step.astNodeIds = step.astNodeIds.map((oldId) => this.getNewId(oldId));
        });
    }
    getOrGenerateNewId(oldId) {
        return this.oldNewIds.getOrCreate(oldId, () => (0, node_crypto_1.randomUUID)());
    }
    getNewId(oldId) {
        const newId = this.oldNewIds.get(oldId);
        if (!newId)
            throw new Error(`New ID is not found for old ID: ${oldId}`);
        return newId;
    }
}
exports.GherkinDocumentClone = GherkinDocumentClone;
//# sourceMappingURL=GherkinDocumentClone.js.map