"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRun = void 0;
const node_crypto_1 = require("node:crypto");
const timing_1 = require("./timing");
const error_1 = require("./error");
class TestRun {
    constructor() {
        this.id = (0, node_crypto_1.randomUUID)();
        this.globalErrors = [];
    }
    buildTestRunStarted({ startTime }) {
        const testRunStarted = {
            id: this.id,
            timestamp: (0, timing_1.toCucumberTimestamp)(startTime.getTime()),
        };
        return { testRunStarted };
    }
    buildTestRunFinished({ status, startTime, duration }) {
        const error = this.globalErrors[0];
        const testRunFinished = {
            testRunStartedId: this.id,
            success: status === 'passed',
            timestamp: (0, timing_1.toCucumberTimestamp)(startTime.getTime() + duration),
            // We populate 'exception' property, although HTML reporter does not use it yet.
            // See: https://github.com/cucumber/html-formatter/issues/340
            exception: error ? (0, error_1.buildException)(error) : undefined,
        };
        return { testRunFinished };
    }
    registerGlobalError(error) {
        this.globalErrors.push(error);
    }
}
exports.TestRun = TestRun;
//# sourceMappingURL=TestRun.js.map