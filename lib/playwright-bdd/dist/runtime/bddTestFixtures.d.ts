/**
 * Test-scoped fixtures added by playwright-bdd.
 */
import { BddStepFn } from './bddStepInvoker';
import { TestTypeCommon } from '../playwright/types';
import { TestInfo } from '@playwright/test';
import { BddTestData } from '../bddData/types';
import { BddContext, BddStepInfo } from './bddContext';
export type BddTestFixtures = {
    $bddContext: BddContext;
    Given: BddStepFn;
    When: BddStepFn;
    Then: BddStepFn;
    And: BddStepFn;
    But: BddStepFn;
    $bddFileData: BddTestData[];
    $bddTestData?: BddTestData;
    $tags: string[];
    $test: TestTypeCommon;
    $testInfo: TestInfo;
    $step: BddStepInfo;
    $uri: string;
    $applySpecialTags: void;
    $world: unknown;
    $beforeEachFixtures: Record<string, unknown>;
    $beforeEach: void;
    $afterEachFixtures: Record<string, unknown>;
    $afterEach: void;
};
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & BddTestFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions & import("./bddWorkerFixtures").BddWorkerFixtures>;
//# sourceMappingURL=bddTestFixtures.d.ts.map