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
exports.toEmbeddedAttachment = toEmbeddedAttachment;
exports.toExternalAttachment = toExternalAttachment;
exports.isTextAttachment = isTextAttachment;
/**
 * Handles externalizing attachments.
 */
const node_fs_1 = __importDefault(require("node:fs"));
const messages = __importStar(require("@cucumber/messages"));
const node_path_1 = __importDefault(require("node:path"));
const mime_types_1 = __importDefault(require("mime-types"));
const utils_1 = require("../../../utils");
const paths_1 = require("../../../utils/paths");
const helpers_1 = require("./helpers");
function toEmbeddedAttachment(attachment) {
    if (attachment.body)
        return attachment;
    const attachmentPath = attachment.url;
    if (!attachmentPath) {
        throw new Error(`Attachment without body and url: ${JSON.stringify(attachment)}`);
    }
    // add cache for file reading
    const body = node_fs_1.default.readFileSync(attachmentPath).toString('base64');
    const contentEncoding = messages.AttachmentContentEncoding.BASE64;
    return {
        ...attachment,
        body,
        contentEncoding,
        url: undefined,
    };
}
/**
 * See implementation in Playwright HTML reporter:
 * https://github.com/microsoft/playwright/blob/412073253f03099d0fe4081b26ad5f0494fea8d2/packages/playwright/src/reporters/html.ts#L428
 */
function toExternalAttachment(attachment, attachmentsDir, attachmentsBaseURL) {
    // add cache for file reading
    const buffer = attachment.url
        ? node_fs_1.default.readFileSync(attachment.url)
        : (0, helpers_1.getAttachmentBodyAsBuffer)(attachment);
    const extension = getAttachmentExtension(attachment);
    const fileName = (0, utils_1.calculateSha1)(buffer) + '.' + extension;
    const filePath = node_path_1.default.join(attachmentsDir, fileName);
    // todo: save file async?
    // without converting to Uint8Array TS complains about buffer type
    node_fs_1.default.writeFileSync(filePath, new Uint8Array(buffer));
    return {
        ...attachment,
        contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
        body: '',
        url: `${attachmentsBaseURL}/${fileName}`,
    };
}
/**
 * Returns extension for the attachment (without dot).
 */
function getAttachmentExtension(attachment) {
    if (attachment.url)
        return node_path_1.default.extname(attachment.url).replace(/^\./, '');
    const extFromFileName = attachment.fileName
        ? (0, paths_1.sanitizeForFilePath)(node_path_1.default.extname(attachment.fileName).replace(/^\./, ''))
        : '';
    return extFromFileName || mime_types_1.default.extension(attachment.mediaType) || 'dat';
}
// See also PW implementation: https://github.com/microsoft/playwright/blob/412073253f03099d0fe4081b26ad5f0494fea8d2/packages/playwright/src/reporters/html.ts#L572
function isTextAttachment(attachment) {
    return /^(text\/|application\/json)/.test(attachment.mediaType);
}
//# sourceMappingURL=external.js.map