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
exports.isAttachmentEnvelope = isAttachmentEnvelope;
exports.getAttachmentBodyAsBuffer = getAttachmentBodyAsBuffer;
exports.getAttachmentBodyAsBase64 = getAttachmentBodyAsBase64;
const messages = __importStar(require("@cucumber/messages"));
function isAttachmentEnvelope(envelope) {
    return Boolean(envelope.attachment);
}
function getAttachmentBodyAsBuffer(attachment) {
    const encoding = attachment.contentEncoding === messages.AttachmentContentEncoding.BASE64 ? 'base64' : 'utf-8';
    return Buffer.from(attachment.body, encoding);
}
function getAttachmentBodyAsBase64(attachment) {
    return attachment.contentEncoding === messages.AttachmentContentEncoding.BASE64
        ? attachment.body
        : Buffer.from(attachment.body).toString('base64');
}
//# sourceMappingURL=helpers.js.map