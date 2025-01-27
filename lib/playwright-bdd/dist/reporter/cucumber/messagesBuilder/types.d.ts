import * as messages from '@cucumber/messages';
export type ConcreteEnvelope<T extends keyof messages.Envelope> = Required<Pick<messages.Envelope, T>>;
export type AttachmentEnvelope = ConcreteEnvelope<'attachment'>;
//# sourceMappingURL=types.d.ts.map