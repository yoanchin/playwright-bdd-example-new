"use strict";
/**
 * Step definition class.
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _StepDefinition_expression, _StepDefinition_tagsExpression;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepDefinition = void 0;
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const messages_1 = require("@cucumber/messages");
const parameterTypes_1 = require("./parameterTypes");
const matchedStepDefinition_1 = require("./matchedStepDefinition");
const tags_1 = require("./tags");
const paths_1 = require("../utils/paths");
class StepDefinition {
    constructor(options) {
        this.options = options;
        _StepDefinition_expression.set(this, void 0);
        _StepDefinition_tagsExpression.set(this, void 0);
        this.buildTagsExpression();
    }
    get keyword() {
        return this.options.keyword;
    }
    get pattern() {
        return this.options.pattern;
    }
    get fn() {
        return this.options.fn;
    }
    get uri() {
        return this.options.location.file;
    }
    get line() {
        return this.options.location.line;
    }
    get customTest() {
        return this.options.customTest;
    }
    get pomNode() {
        return this.options.pomNode;
    }
    get worldFixture() {
        return this.options.worldFixture;
    }
    get expression() {
        // create expression lazily b/c we need all parameter types to be loaded
        if (!__classPrivateFieldGet(this, _StepDefinition_expression, "f")) {
            __classPrivateFieldSet(this, _StepDefinition_expression, typeof this.pattern === 'string'
                ? new cucumber_expressions_1.CucumberExpression(this.pattern, parameterTypes_1.parameterTypeRegistry)
                : new cucumber_expressions_1.RegularExpression(this.pattern, parameterTypes_1.parameterTypeRegistry), "f");
        }
        return __classPrivateFieldGet(this, _StepDefinition_expression, "f");
    }
    get patternString() {
        return typeof this.pattern === 'string' ? this.pattern : this.pattern.source;
    }
    /**
     * Decorator steps have pom node.
     */
    isDecorator() {
        return Boolean(this.options.pomNode);
    }
    /**
     * New cucumber-style steps have worldFixture in step config.
     */
    isCucumberStyle() {
        return Boolean(this.options.worldFixture);
    }
    /**
     * Tries to match step text.
     * Returns MatchedStepDefinition in case of success.
     */
    matchStepText(stepText) {
        const result = this.expression.match(stepText);
        if (result) {
            return new matchedStepDefinition_1.MatchedStepDefinition(this, stepText, result);
        }
    }
    matchesTags(tags) {
        return __classPrivateFieldGet(this, _StepDefinition_tagsExpression, "f") ? __classPrivateFieldGet(this, _StepDefinition_tagsExpression, "f").evaluate(tags) : true;
    }
    // eslint-disable-next-line visual/complexity
    matchesKeywordType(keywordType) {
        if (!keywordType || keywordType === messages_1.PickleStepType.UNKNOWN)
            return true;
        switch (this.keyword) {
            case 'Given':
                return keywordType === messages_1.PickleStepType.CONTEXT;
            case 'When':
                return keywordType === messages_1.PickleStepType.ACTION;
            case 'Then':
                return keywordType === messages_1.PickleStepType.OUTCOME;
            default: // Unknown
                return true;
        }
    }
    buildTagsExpression() {
        const { defaultTags, providedOptions, location } = this.options;
        // Possibly, we should use relative to configDir
        const relFilePath = (0, paths_1.relativeToCwd)(location.file);
        const tagsFromPath = (0, tags_1.extractTagsFromPath)(relFilePath);
        __classPrivateFieldSet(this, _StepDefinition_tagsExpression, (0, tags_1.buildTagsExpression)([
            ...tagsFromPath,
            defaultTags,
            providedOptions?.tags,
        ]), "f");
    }
}
exports.StepDefinition = StepDefinition;
_StepDefinition_expression = new WeakMap(), _StepDefinition_tagsExpression = new WeakMap();
//# sourceMappingURL=stepDefinition.js.map