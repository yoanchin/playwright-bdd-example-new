/**
 * Tracks PomNodes used in the particular scenario.
 * To select correct fixture for decorator steps.
 *
 * Idea: try to use the deepest child fixture for parent steps.
 *
 * Example of POM inheritance tree:
 *      A
 *     / \
 *    B   C
 *
 * Cases:
 * If test uses steps from classes A and B:
 * -> resolved fixture will be B, even for steps from A.
 *
 * If test uses steps from classes B and C:
 * -> resolved fixtures will be B and C
 *
 * If test uses steps from classes A, B and C:
 * NEW (statefulPoms = false): -> resolved fixtures will be A, B and C, each used for own steps (see #102)
 * OLD (statefulPoms = true): -> error, b/c A has 2 possible fixtures.
 *
 * @fixture:xxx tag can provide a hint, which fixture to use in ambiguous situations
 * (especially for Background steps).
 *
 * If test uses steps from classes A, B and C; and has tag @fixture:C
 * NEW (statefulPoms = false): -> resolved fixtures will be B and C (C used for steps from A)
 * OLD (statefulPoms = true): -> error, b/c A has 2 possible fixtures.
 *
 * If test uses steps from classes A and B, and has @fixture:C
 * -> actually @fixture tag has no effect, resolved fixture will be A and B (warning?)
 */
import { PomNode } from '../steps/decorators/pomGraph';
export type UsedFixture = {
    name: string;
    byTag: boolean;
};
export declare class TestPoms {
    private testTitle;
    private usedPoms;
    constructor(testTitle: string);
    registerPomNode(pomNode: PomNode, { byTag }?: {
        byTag?: boolean | undefined;
    }): void;
    registerPomNodeByFixtureName(fixtureName: string): void;
    registerPomNodeByTag(tag: string): void;
    /**
     * Resolve all used pomNodes to fixtures.
     * This is needed to handle @fixture: tagged pomNodes
     * that does not have steps in the test, but should be considered.
     */
    resolveFixtures(): void;
    /**
     * Returns fixtures suitable for particular pomNode (actually for step).
     * Filter out pomNodes with empty fixture names (as they are not marked with @Fixture decorator)
     */
    getResolvedFixtures(pomNode: PomNode): UsedFixture[];
    /**
     * For scenarios with @fixture:xxx tags verify that there are no steps from fixtures,
     * deeper than xxx.
     * @fixture:xxx tag provides maximum fixture that can be used in the scenario.
     */
    private verifyChildFixtures;
}
//# sourceMappingURL=testPoms.d.ts.map