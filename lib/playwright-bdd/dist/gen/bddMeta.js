"use strict";
/**
 * Class to build and print testMeta object containing meta info about each test.
 * Tests are identified by special key constructed from title path.
 *
 * Example:
 * const bddMetaMap = {
 *  "Simple scenario": { pickleLocation: "3:10", tags: ["@foo"] },
 *  "Scenario with examples|Example #1": { pickleLocation: "8:26", tags: [] },
 *  "Rule 1|Scenario with examples|Example #1": { pickleLocation: "9:42", tags: [] },
 * };
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBddTestMeta = exports.BddFileMetaBuilder = void 0;
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
const TEST_KEY_SEPARATOR = '|';
let logger = new logger_1.Logger({ verbose: false });
class BddFileMetaBuilder {
    constructor() {
        this.tests = [];
    }
    get testCount() {
        return this.tests.length;
    }
    registerTest(node, pickle) {
        const bddTestMeta = {
            pickleLocation: (0, utils_1.stringifyLocation)(pickle.location),
            tags: node.tags.length ? node.tags : undefined,
            // todo: avoid duplication of tags and ownTags
            ownTags: node.ownTags.length ? node.ownTags : undefined,
        };
        logger.log(JSON.stringify(bddTestMeta, null, 2));
        logger.log(JSON.stringify(pickle.location, null, 2));
        this.tests.push({ node, bddTestMeta });
    }
    getObjectLines() {
        // build object line by line to have each test on a separate line,
        // but value should be in one line.
        return this.tests.map((test) => {
            const testKey = this.getTestKey(test.node);
            return `${JSON.stringify(testKey)}: ${JSON.stringify(test.bddTestMeta)},`;
        });
    }
    getTestKey(node) {
        // .slice(1) -> b/c we remove top describe title (it's same for all tests)
        return node.titlePath.slice(1).join(TEST_KEY_SEPARATOR);
    }
}
exports.BddFileMetaBuilder = BddFileMetaBuilder;
function getBddTestMeta(bddFileMeta, testInfo) {
    // .slice(2) -> b/c we remove filename and top describe title
    const key = testInfo.titlePath.slice(2).join(TEST_KEY_SEPARATOR);
    return bddFileMeta[key];
    // Before we throw if key not found in testMetaMap.
    // Now we just return undefined, b/c testMetaMap is empty for non-bdd projects.
    // It is easier than checking is current project BDD or non-BDD.
    // Although we can swallow some errors.
    // See: https://github.com/vitalets/playwright-bdd/issues/189
}
exports.getBddTestMeta = getBddTestMeta;
//# sourceMappingURL=bddMeta.js.map