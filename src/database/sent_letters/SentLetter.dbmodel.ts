export class SentLetter {
  letterRecipient: string;
  letterId: string;
  sentAt: Date | null;
  letterContents: string;
  letterSignature: string;

  constructor(
    letterRecipient: string,
    letterId: string,
    sentAt: Date | null,
    letterContents: Buffer,
    letterSignature: string
  ) {
    this.letterRecipient = letterRecipient;
    this.letterId = letterId;
    this.sentAt = sentAt;
    if (letterContents !== null) {
      this.letterContents = letterContents.toString("utf8");
    } else {
      this.letterContents = null;
    }
    this.letterSignature = letterSignature;
  }

  static dbRowToDbModel(dbRow: any): SentLetter {
    const newSentLetter = new SentLetter(
      dbRow.letter_recipient,
      dbRow.letter_id,
      dbRow.sent_at,
      dbRow.letter_contents,
      dbRow.letter_signature
    );
    console.dir(newSentLetter);
    return newSentLetter;
  }
}
