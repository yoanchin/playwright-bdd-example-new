/**
 * Class to invoke step in playwright runner.
 */
import { PickleStepArgument } from '@cucumber/messages';
import { BddContext } from './bddContext';
export type BddStepFn = BddStepInvoker['invoke'];
export declare class BddStepInvoker {
    private bddContext;
    private stepFinder;
    constructor(bddContext: BddContext);
    /**
     * Invokes particular step.
     * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/test_case_runner.ts#L299
     */
    invoke(stepText: string, // step text without keyword
    argument?: PickleStepArgument | null, stepFixtures?: Record<string, unknown>): Promise<void>;
    private findStepDefinition;
    private getStepParameters;
    private getStepFixtures;
    private getStepTextWithKeyword;
    private getBddStepData;
}
//# sourceMappingURL=bddStepInvoker.d.ts.map