import { BDDConfig } from '../config/types';
import { StepDefinition } from '../steps/stepDefinition';
export declare class TestFilesGenerator {
    private config;
    private featuresLoader;
    private files;
    private tagsExpression?;
    private logger;
    constructor(config: BDDConfig);
    generate(): Promise<void>;
    extractSteps(): Promise<StepDefinition[]>;
    extractUnusedSteps(): Promise<StepDefinition[]>;
    private loadFeatures;
    private loadSteps;
    private buildFiles;
    private checkMissingSteps;
    private handleImportTestFrom;
    private saveFiles;
    private clearOutputDir;
    private handleFeatureParseErrors;
    private printFoundSteps;
}
//# sourceMappingURL=index.d.ts.map