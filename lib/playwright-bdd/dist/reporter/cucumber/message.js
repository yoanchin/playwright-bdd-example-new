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
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importStar(require("./base"));
class MessageReporter extends base_1.default {
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.setOutputStream(this.userOptions.outputFile);
        this.eventBroadcaster.on('envelope', (envelope) => {
            if (!(0, base_1.isAttachmentAllowed)(envelope, this.userOptions.skipAttachments))
                return;
            this.outputStream.write(JSON.stringify(envelope) + '\n');
        });
    }
}
exports.default = MessageReporter;
//# sourceMappingURL=message.js.map