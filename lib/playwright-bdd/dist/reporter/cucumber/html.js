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
/**
 * Cucumber html reporter.
 * Based on: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/html_formatter.ts
 * See: https://github.com/cucumber/html-formatter
 * See: https://github.com/cucumber/react-components
 */
const promises_1 = require("node:stream/promises");
const html_formatter_1 = require("@cucumber/html-formatter");
const utils_1 = require("../../utils");
const node_path_1 = __importDefault(require("node:path"));
const base_1 = __importStar(require("./base"));
class HtmlReporter extends base_1.default {
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.setOutputStream(this.userOptions.outputFile);
        const packageRoot = (0, utils_1.resolvePackageRoot)('@cucumber/html-formatter');
        this.htmlStream = new html_formatter_1.CucumberHtmlStream(node_path_1.default.join(packageRoot, 'dist/main.css'), node_path_1.default.join(packageRoot, 'dist/main.js'));
        this.eventBroadcaster.on('envelope', (envelope) => {
            if (!(0, base_1.isAttachmentAllowed)(envelope, this.userOptions.skipAttachments))
                return;
            this.htmlStream.write(envelope);
        });
        this.htmlStream.pipe(this.outputStream);
    }
    async finished() {
        this.htmlStream.end();
        await (0, promises_1.finished)(this.htmlStream);
        await super.finished();
    }
}
exports.default = HtmlReporter;
//# sourceMappingURL=html.js.map