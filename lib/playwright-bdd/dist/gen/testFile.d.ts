/**
 * Generate Playwright test file for feature.
 */
import { Step, PickleStep } from '@cucumber/messages';
import parseTagsExpression from '@cucumber/tag-expressions';
import { GherkinDocumentWithPickles } from '../features/load';
import { BDDConfig } from '../config/types';
import { StepDefinition } from '../steps/registry';
import { KeywordType } from '../cucumber/keywordType';
type TestFileOptions = {
    gherkinDocument: GherkinDocumentWithPickles;
    outputPath: string;
    config: BDDConfig;
    tagsExpression?: ReturnType<typeof parseTagsExpression>;
};
export type UndefinedStep = {
    keywordType: KeywordType;
    step: Step;
    pickleStep: PickleStep;
};
export declare class TestFile {
    private options;
    private lines;
    private i18nKeywordsMap?;
    private formatter;
    private bddFileMetaBuilder;
    private usedDecoratorFixtures;
    undefinedSteps: UndefinedStep[];
    featureUri: string;
    usedStepDefinitions: Set<StepDefinition>;
    private logger;
    constructor(options: TestFileOptions);
    get gherkinDocument(): GherkinDocumentWithPickles;
    get pickles(): import("../features/load").PickleWithLocation[];
    get content(): string;
    get language(): string;
    get isEnglish(): boolean;
    get config(): BDDConfig;
    get outputPath(): string;
    get testCount(): number;
    build(): this;
    save(): void;
    private getFileHeader;
    private loadI18nKeywords;
    private getFeatureUri;
    private resolveImportTestFrom;
    private getTechnicalSection;
    private getRootSuite;
    /**
     * Generate test.describe suite for root Feature or Rule
     */
    private getSuite;
    private getSuiteChild;
    private getScenarioLines;
    /**
     * Generate test.beforeEach for Background
     */
    private getBeforeEach;
    /**
     * Generate test.describe suite for Scenario Outline
     */
    private getOutlineSuite;
    /**
     * Generate test from Examples row of Scenario Outline
     */
    private getOutlineTest;
    /**
     * Generate test from Scenario
     */
    private getTest;
    /**
     * Generate test steps
     */
    private getSteps;
    /**
     * Generate step for Given, When, Then
     */
    private getStep;
    private getMissingStep;
    /**
     * Returns pickle for scenario.
     * Pickle is executable entity including background and steps with example values.
     */
    private findPickle;
    /**
     * Returns pickleStep for ast step.
     * PickleStep contains step text with inserted example values.
     *
     * Note:
     * When searching for pickleStep iterate all pickles in a file
     * b/c for background steps there is no own pickle.
     * This can be optimized: pass optional 'pickle' parameter
     * and search only inside it if it exists.
     * But this increases code complexity, and performance impact seems to be minimal
     * b/c number of pickles inside feature file is not very big.
     */
    private findPickleStep;
    private getStepEnglishKeyword;
    private getStepFixtureNames;
    private getOutlineTestTitle;
    private getExamplesTitleFormat;
    private getExamplesTitleFormatFromComment;
    private getExamplesTitleFormatFromScenarioName;
    private skipByTagsExpression;
    private isOutline;
    private getEnglishKeyword;
    private getWorldFixtureName;
}
export {};
//# sourceMappingURL=testFile.d.ts.map