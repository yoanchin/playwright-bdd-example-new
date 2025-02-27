/**
 * Generate Playwright test file for feature.
 */
import parseTagsExpression from '@cucumber/tag-expressions';
import { GherkinDocumentWithPickles, PickleWithLocation } from '../features/types';
import { BDDConfig } from '../config/types';
import { StepDefinition } from '../steps/stepDefinition';
import { StepData } from './test';
type TestFileOptions = {
    config: BDDConfig;
    gherkinDocument: GherkinDocumentWithPickles;
    tagsExpression?: ReturnType<typeof parseTagsExpression>;
};
export declare class TestFile {
    private options;
    private lines;
    private i18nKeywordsMap?;
    private formatter;
    private gherkinDocumentQuery;
    private stepFinder;
    private hooks;
    private backgrounds;
    private tests;
    private tagsFromPath;
    outputPath: string;
    constructor(options: TestFileOptions);
    get gherkinDocument(): GherkinDocumentWithPickles;
    /**
     * Returns to feature file, relative to configDir.
     * Separator is OS-specific (/ on Unix, \ on Windows).
     */
    get featureUri(): string;
    get pickles(): PickleWithLocation[];
    get content(): string;
    get language(): string;
    get isEnglish(): boolean;
    get config(): BDDConfig;
    hasExecutableTests(): boolean;
    build(): this;
    /**
     * Collect missing steps for all tests in the feature file.
     */
    getMissingSteps(): StepData[];
    getUsedDefinitions(): Set<StepDefinition>;
    private renderFileHeader;
    private loadI18nKeywords;
    private renderTechnicalSection;
    private renderRootSuite;
    /**
     * Generate test.describe suite for Feature or Rule
     */
    private renderDescribe;
    private renderChild;
    private renderBackgroundPlaceholder;
    /**
     * Insert test.beforeEach for Backgrounds
     */
    private renderInplaceBackgrounds;
    private renderScenario;
    /**
     * Generate test.describe suite for Scenario Outline
     */
    private renderScenarioOutline;
    /**
     * Render test for Scenario or Scenario Outline.
     */
    private renderTest;
    private findPickle;
    private isSkippedByTagsExpression;
    private getWorldFixtureName;
    private createExamplesTitleBuilder;
    private resolveImportTestFrom;
    private getUsedPomFixtures;
}
export {};
//# sourceMappingURL=file.d.ts.map