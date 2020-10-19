import { User } from "../users/User.dbmodel";

export class LetterHistory {
  letterId: string;
  letterRequestor: User;
  letterWriter: User;
  requestedAt: Date;
  uploadedAt: Date | null;
  letterRecipient: User;
  sentAt: Date | null;

  constructor(
    letterId: string,
    letterRequestorId: string,
    letterRequestorName: string,
    letterWriterId: string,
    letterWriterName: string,
    requestedAt: Date,
    uploadedAt: Date | null,
    letterRecipientId: string,
    letterRecipientName: string,
    sentAt: Date | null
  ) {
    this.letterId = letterId;
    this.letterRequestor = new User(letterRequestorId, letterRequestorName);
    this.letterWriter = new User(letterWriterId, letterWriterName);
    this.requestedAt = requestedAt;
    this.uploadedAt = uploadedAt;
    this.letterRecipient = new User(letterRecipientId, letterRecipientName);
    this.sentAt = sentAt;
  }

  static dbRowToDbModel(dbRow: any) {
    const newDbModel = new LetterHistory(
        dbRow.letter_id,
        dbRow.letter_requestor,
        dbRow.letter_requestor_name,
        dbRow.letter_writer,
        dbRow.letter_writer_name,
        dbRow.requested_at,
        dbRow.uploaded_at ? new Date(dbRow.uploaded_at) : dbRow.uploaded_at,
        dbRow.letter_recipient,
        dbRow.letter_recipient_name,
        dbRow.sent_at ? new Date(dbRow.sent_at) : dbRow.sent_at,
    );
    return newDbModel;
}
}
