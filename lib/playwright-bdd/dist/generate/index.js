"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFilesGenerator = void 0;
/**
 * Generate playwright test files from Gherkin documents.
 */
const node_fs_1 = __importDefault(require("node:fs"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const file_1 = require("./file");
const load_1 = require("../features/load");
const snippets_1 = require("../snippets");
const logger_1 = require("../utils/logger");
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const exit_1 = require("../utils/exit");
const loader_1 = require("../steps/loader");
const paths_1 = require("../utils/paths");
const stepRegistry_1 = require("../steps/stepRegistry");
const utils_1 = require("../utils");
class TestFilesGenerator {
    constructor(config) {
        this.config = config;
        this.featuresLoader = new load_1.FeaturesLoader();
        this.files = [];
        this.logger = new logger_1.Logger({ verbose: config.verbose });
        if (config.tags)
            this.tagsExpression = (0, tag_expressions_1.default)(config.tags);
    }
    async generate() {
        await Promise.all([this.loadFeatures(), this.loadSteps()]);
        this.buildFiles();
        this.checkMissingSteps();
        await this.clearOutputDir();
        await this.saveFiles();
    }
    async extractSteps() {
        await this.loadSteps();
        return stepRegistry_1.stepDefinitions;
    }
    // todo: combine with extractSteps
    async extractUnusedSteps() {
        await Promise.all([this.loadFeatures(), this.loadSteps()]);
        this.buildFiles();
        const allUsedDefinitions = this.files.reduce((acc, file) => {
            file.getUsedDefinitions().forEach((definition) => acc.add(definition));
            return acc;
        }, new Set());
        return stepRegistry_1.stepDefinitions.filter((stepDefinition) => {
            return !allUsedDefinitions.has(stepDefinition);
        });
    }
    async loadFeatures() {
        const { configDir, features, language } = this.config;
        const { files, finalPatterns } = await (0, load_1.resolveFeatureFiles)(configDir, features);
        this.logger.log(`Loading features: ${finalPatterns.join(', ')}`);
        this.logger.log(`Found feature files: ${files.length}`);
        files.forEach((featureFile) => this.logger.log(`  - ${(0, paths_1.relativeToCwd)(featureFile)}`));
        await this.featuresLoader.load(files, {
            relativeTo: configDir,
            defaultDialect: language,
        });
        this.handleFeatureParseErrors();
    }
    async loadSteps() {
        const { configDir, steps } = this.config;
        const { files, finalPatterns } = await (0, loader_1.resolveStepFiles)(configDir, steps);
        this.logger.log(`Loading steps: ${finalPatterns.join(', ')}`);
        this.logger.log(`Found step files: ${files.length}`);
        await (0, loader_1.loadSteps)(files);
        this.printFoundSteps(files);
        await this.handleImportTestFrom();
    }
    buildFiles() {
        this.files = this.featuresLoader
            .getDocumentsWithPickles()
            .map((gherkinDocument) => {
            return new file_1.TestFile({
                config: this.config,
                gherkinDocument,
                tagsExpression: this.tagsExpression,
            }).build();
        })
            // render only files that have at least one executable test
            .filter((file) => file.hasExecutableTests());
    }
    checkMissingSteps() {
        if (this.config.missingSteps !== 'fail-on-gen')
            return;
        const missingSteps = [];
        this.files.forEach((file) => missingSteps.push(...file.getMissingSteps()));
        if (missingSteps.length) {
            new snippets_1.Snippets(missingSteps).print();
            (0, exit_1.exit)();
        }
    }
    async handleImportTestFrom() {
        const { importTestFrom } = this.config;
        if (!importTestFrom)
            return;
        // require importTestFrom separately instead of just adding to steps,
        // b/c we need additionally check that it exports "test" variable.
        // If checking by together loaded files, it's become messy to find correct file by url,
        // b/c of win/posix path separator.
        const exportedTests = await (0, loader_1.loadStepsFromFile)(importTestFrom.file);
        const varName = importTestFrom.varName || 'test';
        if (!exportedTests.find((info) => info.varName === varName)) {
            (0, exit_1.exit)(`File "${(0, paths_1.relativeToCwd)(importTestFrom.file)}" pointed by "importTestFrom"`, `should export "${varName}" variable.`);
        }
    }
    async saveFiles() {
        this.logger.log(`Generating Playwright test files: ${this.files.length}`);
        this.files.forEach((file) => {
            (0, utils_1.saveFileSync)(file.outputPath, file.content);
            this.logger.log(`  - ${(0, paths_1.relativeToCwd)(file.outputPath)}`);
        });
    }
    async clearOutputDir() {
        const pattern = `${fast_glob_1.default.convertPathToPattern(this.config.outputDir)}/**/*.spec.js`;
        const testFiles = await (0, fast_glob_1.default)(pattern);
        this.logger.log(`Clearing output dir: ${(0, paths_1.relativeToCwd)(pattern)}`);
        const tasks = testFiles.map((testFile) => node_fs_1.default.promises.rm(testFile));
        await Promise.all(tasks);
    }
    handleFeatureParseErrors() {
        const { parseErrors } = this.featuresLoader;
        if (parseErrors.length) {
            const message = parseErrors
                .map((parseError) => {
                return `Parse error in "${parseError.source.uri}" ${parseError.message}`;
            })
                .join('\n');
            (0, exit_1.exit)(message);
        }
    }
    printFoundSteps(files) {
        if (!this.config.verbose)
            return;
        files.forEach((stepFile) => {
            const normalizedStepFile = (0, paths_1.toPosixPath)(stepFile);
            const definitions = stepRegistry_1.stepDefinitions.filter((definition) => (0, paths_1.toPosixPath)(definition.uri) === normalizedStepFile);
            const suffix = definitions.length === 1 ? 'step' : 'steps';
            this.logger.log(`  - ${(0, paths_1.relativeToCwd)(stepFile)} (${definitions.length} ${suffix})`);
        });
    }
}
exports.TestFilesGenerator = TestFilesGenerator;
//# sourceMappingURL=index.js.map