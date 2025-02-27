"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesBuilder = void 0;
const TestCaseRun_1 = require("./TestCaseRun");
const TestCase_1 = require("./TestCase");
const Meta_1 = require("./Meta");
const node_events_1 = __importDefault(require("node:events"));
const EventDataCollector_js_1 = __importDefault(require("../../../cucumber/formatter/EventDataCollector.js"));
const AutofillMap_js_1 = require("../../../utils/AutofillMap.js");
const GherkinDocuments_1 = require("./GherkinDocuments");
const Pickles_1 = require("./Pickles");
const env_1 = require("../../../config/env");
const TestFiles_1 = require("./TestFiles");
const paths_1 = require("../../../utils/paths");
const TestRun_1 = require("./TestRun");
class MessagesBuilder {
    constructor() {
        this.report = {
            meta: null,
            source: [],
            gherkinDocument: [],
            pickle: [],
            stepDefinition: [],
            hook: [],
            testRunStarted: null,
            testCase: [],
            testCaseRuns: [],
            testRunFinished: null,
        };
        this.testRun = new TestRun_1.TestRun();
        this.testCaseRuns = [];
        this.testCases = new AutofillMap_js_1.AutofillMap();
        this.hooks = new AutofillMap_js_1.AutofillMap();
        this.gherkinDocuments = new GherkinDocuments_1.GherkinDocuments();
        this.testFiles = new TestFiles_1.TestFiles();
        this.onEndPromiseResolve = () => { };
        this.eventDataCollectorEmitter = new node_events_1.default();
        this.eventDataCollector = new EventDataCollector_js_1.default(this.eventDataCollectorEmitter);
        this.onEndPromise = new Promise((resolve) => (this.onEndPromiseResolve = resolve));
    }
    onBegin(config) {
        this.fullConfig = config;
    }
    onTestEnd(test, result) {
        const testDir = test.parent.project()?.testDir || this.fullConfig.rootDir;
        const bddConfig = (0, env_1.getConfigFromEnv)(testDir);
        // Skip tests of non-bdd projects
        if (!bddConfig)
            return;
        const { bddData, featureUri } = this.testFiles.getBddData(test.location.file);
        // todo: move these line somewhere else
        const bddTestData = bddData.find((data) => data.pwTestLine === test.location.line);
        if (!bddTestData) {
            const filePath = (0, paths_1.relativeToCwd)(test.location.file);
            throw new Error(`Cannot find bddTestData for ${filePath}:${test.location.line}`);
        }
        // Important to create TestCaseRun in this method (not later),
        // b/c test properties can change after retries
        // especially annotations where we store bddData
        const testCaseRun = new TestCaseRun_1.TestCaseRun(bddTestData, featureUri, test, result, this.hooks);
        this.testCaseRuns.push(testCaseRun);
    }
    onEnd(fullResult) {
        this.fullResult = fullResult;
        this.onEndPromiseResolve();
    }
    onError(error) {
        this.testRun.registerGlobalError(error);
    }
    /**
     * Builds Cucumber messages.
     * Note: wrapped into promise to build messages once for all reporters.
     */
    async buildMessages() {
        if (!this.buildMessagesPromise)
            this.buildMessagesPromise = this.doBuildMessages();
        return this.buildMessagesPromise;
    }
    async doBuildMessages() {
        await this.onEndPromise;
        // order here is important
        await this.loadFeatures();
        this.createTestCases();
        this.addMeta();
        this.addSourcesAndDocuments();
        this.addPickles();
        this.addHooks();
        this.addTestRun();
        this.addTestCases();
        this.addTestCaseRuns();
        this.buildEventDataCollector();
    }
    emitMessages(eventBroadcaster) {
        Object.values(this.report).forEach((value) => {
            if (!value)
                return;
            const messages = Array.isArray(value) ? value : [value];
            messages.forEach((message) => eventBroadcaster.emit('envelope', message));
        });
    }
    createTestCases() {
        this.testCaseRuns.forEach((testCaseRun) => {
            const testId = testCaseRun.test.id;
            const gherkinDocsForProject = this.gherkinDocuments.getDocumentsForProject(testCaseRun.projectInfo);
            const testCase = this.testCases.getOrCreate(testId, () => new TestCase_1.TestCase(testId, gherkinDocsForProject, this.testRun.id));
            testCase.addRun(testCaseRun);
            testCaseRun.testCase = testCase;
        });
    }
    async loadFeatures() {
        await this.gherkinDocuments.load(this.testCaseRuns);
    }
    addMeta() {
        this.report.meta = new Meta_1.Meta().buildMessage();
    }
    addSourcesAndDocuments() {
        const { sources, gherkinDocuments } = this.gherkinDocuments.buildMessages();
        this.report.source = sources;
        this.report.gherkinDocument = gherkinDocuments;
    }
    addPickles() {
        this.report.pickle = new Pickles_1.Pickles().buildMessages(this.testCases);
    }
    addHooks() {
        this.hooks.forEach((hook) => {
            const message = hook.buildMessage();
            this.report.hook.push(message);
        });
    }
    addTestCases() {
        this.testCases.forEach((testCase) => {
            const message = testCase.buildMessage();
            this.report.testCase.push(message);
        });
    }
    addTestCaseRuns() {
        this.testCaseRuns.map((testCaseRun) => {
            const messages = testCaseRun.buildMessages();
            this.report.testCaseRuns.push(...messages);
        });
    }
    addTestRun() {
        this.report.testRunStarted = this.testRun.buildTestRunStarted(this.fullResult);
        this.report.testRunFinished = this.testRun.buildTestRunFinished(this.fullResult);
    }
    buildEventDataCollector() {
        this.emitMessages(this.eventDataCollectorEmitter);
    }
}
exports.MessagesBuilder = MessagesBuilder;
//# sourceMappingURL=index.js.map