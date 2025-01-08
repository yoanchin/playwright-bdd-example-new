"use strict";
/**
 * Universal TestNode class representing test or suite in a test file.
 * Holds parent-child links.
 * Allows to inherit tags and titles path.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestNode = void 0;
const utils_1 = require("../utils");
const specialTags_1 = require("../specialTags");
class TestNode {
    constructor(gherkinNode, parent) {
        this.title = gherkinNode.name;
        this.titlePath = (parent?.titlePath || []).concat([this.title]);
        this.ownTags = (0, utils_1.removeDuplicates)(getTagNames(gherkinNode.tags));
        this.tags = (0, utils_1.removeDuplicates)((parent?.tags || []).concat(this.ownTags));
        this.specialTags = new specialTags_1.SpecialTags(this.ownTags);
    }
    isSkipped() {
        return this.specialTags.skip || this.specialTags.fixme;
    }
}
exports.TestNode = TestNode;
function getTagNames(tags) {
    return tags.map((tag) => tag.name);
}
//# sourceMappingURL=testNode.js.map