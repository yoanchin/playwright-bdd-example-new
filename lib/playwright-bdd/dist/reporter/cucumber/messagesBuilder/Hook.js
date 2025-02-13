"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
/**
 * Hook that can be used in different test cases.
 * Builds Cucumber's hook message.
 * See: https://github.com/cucumber/messages/blob/main/messages.md#hook
 *
 * Hook is created from TestCaseRunHooks class.
 */
const node_crypto_1 = require("node:crypto");
const messages = __importStar(require("@cucumber/messages"));
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("../../../config/env");
const const_1 = require("../../../hooks/const");
const pwStepUtils_1 = require("./pwStepUtils");
class Hook {
    // persistent hook ID to avoid hook duplicates due to several run of hook.
    static getInternalId(pwStep) {
        const { file, line, column } = pwStep.location || {};
        return [pwStep.category, ...pwStep.titlePath(), file, line, column].join('|');
    }
    constructor(internalId, group, 
    /* one of pwSteps for this hook */
    pwStep) {
        this.internalId = internalId;
        this.pwStep = pwStep;
        this.id = (0, node_crypto_1.randomUUID)();
        this.hookType = group === 'before' ? this.getBeforeHookType() : this.getAfterHookType();
    }
    buildMessage() {
        const hook = {
            type: this.hookType,
            name: this.getName(),
            id: this.id,
            sourceReference: this.getSourceReference(),
        };
        return { hook };
    }
    getName() {
        // These fixture names are for anonymous hooks
        // created with Before() / After() functions.
        // Keep name empty for them to be consistent with Cucumber.
        // const bddSystemFixtures = ['fixture: $before', 'fixture: $after'];
        // if (!pwStep.title || bddSystemFixtures.includes(pwStep.title)) return undefined;
        return this.pwStep.title;
    }
    getBeforeHookType() {
        // beforeEach hooks are located inside the hooks group created by test.beforeEach()
        const beforeHooksGroupStep = (0, pwStepUtils_1.findParentWith)(this.pwStep, (step) => {
            return step.category === 'hook' && step.title === const_1.BEFORE_EACH_HOOKS_GROUP_NAME;
        });
        return beforeHooksGroupStep
            ? messages.HookType.BEFORE_TEST_CASE
            : messages.HookType.BEFORE_TEST_RUN;
    }
    getAfterHookType() {
        // afterEach hooks are NOT located inside the hooks group created by test.afterEach()
        // possibly bug in the Playwright.
        // We distinguish them by the fact, that worker hooks are not executed via test.step()
        // See: https://github.com/microsoft/playwright/issues/33750
        // This may change in the future.
        return this.pwStep.category === 'test.step'
            ? messages.HookType.AFTER_TEST_CASE
            : messages.HookType.AFTER_TEST_RUN;
    }
    getSourceReference() {
        const { file, line, column } = this.pwStep.location || {};
        const uri = file ? node_path_1.default.relative((0, env_1.getConfigDirFromEnv)(), file) : undefined;
        const location = line ? { line, column } : undefined;
        return { uri, location };
    }
}
exports.Hook = Hook;
//# sourceMappingURL=Hook.js.map