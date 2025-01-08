"use strict";
/**
 * Cucumber json reporter.
 * Based on: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/json_formatter.ts
 *
 * Although json reporter is marked as deprecated in CucumberJS docs
 * (see https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md#json),
 * this decision was rolled back:
 * (see https://github.com/cucumber/json-formatter/issues/34).
 *
 * See also: separate tool to convert cucumber messages to cucumber json:
 * https://github.com/vrymar/cucumber-json-report-formatter/tree/master
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-lines, max-statements, max-nested-callbacks, visual/complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
const messages = __importStar(require("@cucumber/messages"));
const base_1 = __importStar(require("./base"));
const GherkinDocumentParser = __importStar(require("../../cucumber/formatter/GherkinDocumentParser"));
const PickleParser = __importStar(require("../../cucumber/formatter/PickleParser"));
const valueChecker_1 = require("../../cucumber/valueChecker");
const stepArguments_1 = require("../../cucumber/stepArguments");
const durationHelpers_1 = require("../../cucumber/formatter/durationHelpers");
// import { formatLocation } from '../../cucumber/formatter/locationHelpers';
const GherkinDocument_1 = require("./messagesBuilder/GherkinDocument");
const Projects_1 = require("./messagesBuilder/Projects");
const { getGherkinExampleRuleMap, getGherkinScenarioLocationMap, getGherkinStepMap, getGherkinScenarioMap, } = GherkinDocumentParser;
const { getScenarioDescription, getPickleStepMap, getStepKeyword } = PickleParser;
class JsonReporter extends base_1.default {
    // for now omit adding step definitions to json report
    // private supportCodeLibrary: Pick<ISupportCodeLibrary, 'stepDefinitions'> = {
    //   stepDefinitions: [],
    // };
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.setOutputStream(this.userOptions.outputFile);
        this.eventBroadcaster.on('envelope', (envelope) => {
            if ((0, valueChecker_1.doesHaveValue)(envelope.testRunFinished)) {
                this.onTestRunFinished();
            }
        });
    }
    convertNameToId(obj) {
        return obj.name.replace(/ /g, '-').toLowerCase();
    }
    formatDataTable(dataTable) {
        return {
            rows: dataTable.rows.map((row) => ({
                cells: row.cells.map((x) => x.value),
            })),
        };
    }
    formatDocString(docString, gherkinStep) {
        return {
            content: docString.content,
            line: gherkinStep.docString?.location.line,
        };
    }
    formatStepArgument(stepArgument, gherkinStep) {
        if ((0, valueChecker_1.doesNotHaveValue)(stepArgument)) {
            return [];
        }
        return [
            (0, stepArguments_1.parseStepArgument)(stepArgument, {
                dataTable: (dataTable) => this.formatDataTable(dataTable),
                docString: (docString) => this.formatDocString(docString, gherkinStep),
            }),
        ];
    }
    onTestRunFinished() {
        const groupedTestCaseAttempts = {};
        this.eventDataCollector.getTestCaseAttempts().forEach((testCaseAttempt) => {
            if (!testCaseAttempt.willBeRetried) {
                const uri = testCaseAttempt.pickle.uri;
                if ((0, valueChecker_1.doesNotHaveValue)(groupedTestCaseAttempts[uri])) {
                    groupedTestCaseAttempts[uri] = [];
                }
                groupedTestCaseAttempts[uri].push(testCaseAttempt);
            }
        });
        const features = Object.keys(groupedTestCaseAttempts).map((uri) => {
            const group = groupedTestCaseAttempts[uri];
            const { gherkinDocument } = group[0];
            const gherkinStepMap = getGherkinStepMap(gherkinDocument);
            const gherkinScenarioMap = getGherkinScenarioMap(gherkinDocument);
            const gherkinExampleRuleMap = getGherkinExampleRuleMap(gherkinDocument);
            const gherkinScenarioLocationMap = getGherkinScenarioLocationMap(gherkinDocument);
            const elements = group.map((testCaseAttempt) => {
                const { pickle } = testCaseAttempt;
                const pickleStepMap = getPickleStepMap(pickle);
                let isBeforeHook = true;
                const steps = testCaseAttempt.testCase.testSteps.map((testStep) => {
                    isBeforeHook = isBeforeHook && !(0, valueChecker_1.doesHaveValue)(testStep.pickleStepId);
                    return this.getStepData({
                        isBeforeHook,
                        gherkinStepMap,
                        pickleStepMap,
                        testStep,
                        testStepAttachments: testCaseAttempt.stepAttachments[testStep.id],
                        testStepResult: testCaseAttempt.stepResults[testStep.id],
                    });
                });
                return this.getScenarioData({
                    feature: gherkinDocument.feature,
                    gherkinScenarioLocationMap,
                    gherkinExampleRuleMap,
                    gherkinScenarioMap,
                    pickle,
                    steps,
                });
            });
            return this.getFeatureData({
                gherkinDocument,
                elements,
            });
        });
        this.outputStream.write(JSON.stringify(features, null, 2));
    }
    getFeatureData({ gherkinDocument, elements }) {
        const meta = GherkinDocument_1.GherkinDocumentMessage.extractMeta(gherkinDocument);
        const feature = gherkinDocument.feature;
        const featureNameWithProject = (0, Projects_1.getFeatureNameWithProject)(meta.projectName, feature.name);
        return {
            description: feature.description,
            elements,
            id: this.convertNameToId({ name: featureNameWithProject }),
            line: feature.location.line,
            keyword: feature.keyword,
            name: this.userOptions.addProjectToFeatureName ? featureNameWithProject : feature.name,
            tags: this.getFeatureTags(feature),
            uri: meta.originalUri,
            metadata: this.getFeatureMetadata(gherkinDocument),
        };
    }
    getFeatureMetadata(gherkinDocument) {
        if (!this.userOptions.addMetadata)
            return;
        const meta = GherkinDocument_1.GherkinDocumentMessage.extractMeta(gherkinDocument);
        const metadata = {
            Project: meta.projectName || '',
            Browser: meta.browserName || '',
        };
        return this.userOptions.addMetadata === 'object'
            ? metadata
            : Object.keys(metadata).map((name) => ({ name, value: metadata[name] }));
    }
    getScenarioData({ feature, gherkinScenarioLocationMap, gherkinExampleRuleMap, gherkinScenarioMap, pickle, steps, }) {
        const description = getScenarioDescription({
            pickle,
            gherkinScenarioMap,
        });
        return {
            description,
            id: this.formatScenarioId({ feature, pickle, gherkinExampleRuleMap }),
            keyword: gherkinScenarioMap[pickle.astNodeIds[0]].keyword,
            line: gherkinScenarioLocationMap[pickle.astNodeIds[pickle.astNodeIds.length - 1]].line,
            name: pickle.name,
            steps,
            tags: this.getScenarioTags({ feature, pickle, gherkinScenarioMap }),
            type: 'scenario',
        };
    }
    formatScenarioId({ feature, pickle, gherkinExampleRuleMap, }) {
        let parts;
        const rule = gherkinExampleRuleMap[pickle.astNodeIds[0]];
        if ((0, valueChecker_1.doesHaveValue)(rule)) {
            parts = [feature, rule, pickle];
        }
        else {
            parts = [feature, pickle];
        }
        return parts.map((part) => this.convertNameToId(part)).join(';');
    }
    getStepData({ isBeforeHook, gherkinStepMap, pickleStepMap, testStep, testStepAttachments, testStepResult, }) {
        const data = {};
        if ((0, valueChecker_1.doesHaveValue)(testStep.pickleStepId)) {
            const pickleStep = pickleStepMap[testStep.pickleStepId];
            data.arguments = this.formatStepArgument(pickleStep.argument, gherkinStepMap[pickleStep.astNodeIds[0]]);
            data.keyword = getStepKeyword({ pickleStep, gherkinStepMap });
            data.line = gherkinStepMap[pickleStep.astNodeIds[0]].location.line;
            data.name = pickleStep.text;
        }
        else {
            data.keyword = isBeforeHook ? 'Before' : 'After';
            data.hidden = true;
        }
        // for now omit adding step definitions to json report
        // if (doesHaveValue(testStep.stepDefinitionIds) && testStep.stepDefinitionIds.length === 1) {
        //   const stepDefinition = this.supportCodeLibrary.stepDefinitions.find(
        //     (s) => s.id === testStep.stepDefinitionIds?.[0],
        //   );
        //   if (doesHaveValue(stepDefinition)) {
        //     data.match = { location: formatLocation(stepDefinition) };
        //   }
        // }
        const { message, status } = testStepResult;
        data.result = {
            status: messages.TestStepResultStatus[status].toLowerCase(),
        };
        if ((0, valueChecker_1.doesHaveValue)(testStepResult.duration)) {
            data.result.duration = (0, durationHelpers_1.durationToNanoseconds)(testStepResult.duration);
        }
        if (status === messages.TestStepResultStatus.FAILED && (0, valueChecker_1.doesHaveValue)(message)) {
            data.result.error_message = message;
        }
        const allowedAttachments = this.getAllowedAttachments(testStepAttachments);
        if (allowedAttachments && allowedAttachments.length > 0) {
            data.embeddings = allowedAttachments.map((attachment) => ({
                data: attachment.contentEncoding === messages.AttachmentContentEncoding.IDENTITY
                    ? Buffer.from(attachment.body).toString('base64')
                    : attachment.body,
                mime_type: attachment.mediaType,
            }));
        }
        return data;
    }
    getFeatureTags(feature) {
        return feature.tags.map((tagData) => ({
            name: tagData.name,
            line: tagData.location.line,
        }));
    }
    getScenarioTags({ feature, pickle, gherkinScenarioMap, }) {
        const scenario = gherkinScenarioMap[pickle.astNodeIds[0]];
        return pickle.tags.map((tagData) => this.getScenarioTag(tagData, feature, scenario));
    }
    getScenarioTag(tagData, feature, scenario) {
        const byAstNodeId = (tag) => tag.id === tagData.astNodeId;
        const flatten = (acc, val) => acc.concat(val);
        const tag = feature.tags.find(byAstNodeId) ||
            scenario.tags.find(byAstNodeId) ||
            scenario.examples
                .map((e) => e.tags)
                .reduce((acc, val) => flatten(acc, val), [])
                .find(byAstNodeId);
        return {
            name: tagData.name,
            line: tag?.location?.line,
        };
    }
    getAllowedAttachments(testStepAttachments) {
        return testStepAttachments?.filter((attachment) => {
            return (0, base_1.isAttachmentAllowed)({ attachment }, this.userOptions.skipAttachments);
        });
    }
}
exports.default = JsonReporter;
//# sourceMappingURL=json.js.map