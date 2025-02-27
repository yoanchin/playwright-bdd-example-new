"use strict";
/**
 * Simple logger
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor(options = {}) {
        this.options = options;
    }
    log(...args) {
        if (this.options.verbose)
            console.log(...args);
    }
    warn(...args) {
        // using log() to output warnings to stdout, not stderr
        console.log(...args);
    }
    error(...args) {
        console.error(...args);
    }
}
exports.Logger = Logger;
// default logger
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map