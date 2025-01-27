/**
 * Class to generate single test from pickle.
 */
import { PickleStep, Step } from '@cucumber/messages';
import { StepFinder } from '../../steps/finder';
import { Formatter } from '../formatter';
import { KeywordsMap } from '../i18n';
import { MatchedStepDefinition } from '../../steps/matchedStepDefinition';
import { PomNode } from '../../steps/decorators/pomGraph';
import { PickleWithLocation } from '../../features/types';
import { BackgroundGen } from '../background';
import { BDDConfig } from '../../config/types';
export type StepData = {
    pickleStep: PickleStep;
    gherkinStep: Step;
    location: string;
    fixtureNames: string[];
    matchedDefinition?: MatchedStepDefinition;
    pomNode?: PomNode;
    pomFixtureName?: string;
    isBg?: boolean;
};
/**
 * Generates steps for a single scenario (test) and updates background steps.
 */
export declare class TestGen {
    private config;
    featureUri: string;
    private i18nKeywordsMap;
    private stepFinder;
    private formatter;
    private backgrounds;
    pickle: PickleWithLocation;
    testTitle: string;
    private scenarioSteps;
    tags: string[];
    stepsData: Map<string, StepData>;
    private specialTags;
    skippedByTag: boolean;
    private skippedByMissingSteps;
    slow: boolean;
    constructor(config: BDDConfig, featureUri: string, i18nKeywordsMap: KeywordsMap | undefined, stepFinder: StepFinder, formatter: Formatter, backgrounds: BackgroundGen[], pickle: PickleWithLocation, testTitle: string, scenarioSteps: readonly Step[], tags: string[], // all tags of test (including tags from path)
    ownTestTags: string[]);
    get ownTimeout(): number | undefined;
    get skipped(): boolean;
    render(): string[];
    private fillStepsData;
    private handleMissingDefinitions;
    private findGherkinStep;
    private findBackgroundStep;
    private findScenarioStep;
    private hasMissingDefinitions;
    private findMatchedDefinition;
    private resolveFixtureNamesForDecoratorSteps;
    private getStepFixtureNames;
}
//# sourceMappingURL=index.d.ts.map