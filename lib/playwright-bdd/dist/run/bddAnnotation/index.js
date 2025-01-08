"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBddDataFromTest = exports.BddAnnotation = void 0;
const createTestStep_1 = require("../../cucumber/createTestStep");
const utils_1 = require("../../utils");
const utils_2 = require("../../playwright/utils");
const logger_1 = require("../../utils/logger");
const BDD_ANNOTATION_NAME = '__bddData';
let logger = new logger_1.Logger({ verbose: false });
class BddAnnotation {
    constructor(testInfo, { pickleLocation }, uri) {
        this.testInfo = testInfo;
        this.data = { uri, pickleLocation, steps: [] };
        this.save({ create: true });
    }
    registerStep(stepDefinition, stepText, pwStepLocation) {
        const step = (0, createTestStep_1.createTestStep)(stepDefinition, stepText);
        this.data.steps.push({
            pwStepLocation: (0, utils_1.stringifyLocation)(pwStepLocation),
            stepMatchArgumentsLists: step.stepMatchArgumentsLists || [],
        });
        this.save();
    }
    save({ create = false } = {}) {
        (0, utils_2.updateAnnotation)(this.testInfo, {
            type: BDD_ANNOTATION_NAME,
            description: JSON.stringify(this.data),
        }, { create });
    }
}
exports.BddAnnotation = BddAnnotation;
function getBddDataFromTest({ annotations }) {
    const annotationIndex = annotations.findIndex(isBddAnnotation);
    const annotation = annotations[annotationIndex];
    logger.log('isBddAnnotation', isBddAnnotation);
    logger.log('annotationIndex', annotationIndex);
    logger.log(JSON.stringify(annotation, null, 2));
    const bddData = annotation?.description
        ? JSON.parse(annotation.description)
        : undefined;
    return { bddData, annotationIndex };
}
exports.getBddDataFromTest = getBddDataFromTest;
function isBddAnnotation(annotation) {
    return annotation.type === BDD_ANNOTATION_NAME;
}
//# sourceMappingURL=index.js.map