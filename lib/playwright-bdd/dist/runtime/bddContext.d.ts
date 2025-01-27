/**
 * BDD context is an object created for each test.
 * Contains all necessary data for BDD test execution.
 */
import { BDDConfig } from '../config/types';
import { TestTypeCommon } from '../playwright/types';
import { TestInfo } from '@playwright/test';
import { BddTestData } from '../bddData/types';
export type BddStepInfo = {
    title: string;
};
export type BddContext = {
    config: BDDConfig;
    featureUri: string;
    test: TestTypeCommon;
    testInfo: TestInfo;
    tags: string[];
    step: BddStepInfo;
    stepIndex: number;
    world: unknown;
    bddTestData: BddTestData;
};
//# sourceMappingURL=bddContext.d.ts.map