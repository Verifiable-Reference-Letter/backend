export class LetterHistoryIdsOnly {

    letterId: string;
    letterRequestorId: string;
    letterWriterId: string;
    requestedAt: Date | null;
    uploadedAt: Date | null;
    letterRecipientId: string;
    sentAt: Date | null;

    constructor(
        letterId: string,
        letterRequestorId: string,
        letterWriterId: string,
        requestedAt: Date | null,
        uploadedAt: Date | null,
        letterRecipientId: string,
        sentAt: Date | null,
    ) {
        this.letterId = letterId;
        this.letterRequestorId = letterRequestorId;
        this.letterWriterId = letterWriterId;
        this.requestedAt = requestedAt;
        this.uploadedAt = uploadedAt;
        this.letterRecipientId = letterRecipientId;
        this.sentAt = sentAt;
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new LetterHistoryIdsOnly(
            dbRow.letter_id,
            dbRow.letter_writer,
            dbRow.letter_requestor,
            dbRow.requested_at,
            dbRow.uploaded_at,
            dbRow.letter_recipient,
            dbRow.sent_at,
        );
        return newDbModel;
    }

}