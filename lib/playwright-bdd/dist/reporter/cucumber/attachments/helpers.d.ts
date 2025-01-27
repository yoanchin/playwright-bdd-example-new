import * as messages from '@cucumber/messages';
import { AttachmentEnvelope } from '../messagesBuilder/types';
export declare function isAttachmentEnvelope(envelope: messages.Envelope): envelope is AttachmentEnvelope;
export declare function getAttachmentBodyAsBuffer(attachment: messages.Attachment): Buffer;
export declare function getAttachmentBodyAsBase64(attachment: messages.Attachment): string;
//# sourceMappingURL=helpers.d.ts.map