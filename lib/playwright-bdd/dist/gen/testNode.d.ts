/**
 * Universal TestNode class representing test or suite in a test file.
 * Holds parent-child links.
 * Allows to inherit tags and titles path.
 */
import { Tag } from '@cucumber/messages';
import { SpecialTags } from '../specialTags';
interface GherkinNode {
    name: string;
    tags: readonly Tag[];
}
export declare class TestNode {
    title: string;
    titlePath: string[];
    ownTags: string[];
    tags: string[];
    specialTags: SpecialTags;
    constructor(gherkinNode: GherkinNode, parent?: TestNode);
    isSkipped(): boolean | undefined;
}
export {};
//# sourceMappingURL=testNode.d.ts.map