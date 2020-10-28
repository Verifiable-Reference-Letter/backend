export class SentLetter {

    letterRecipient: string;
    letterId: string;
    sentAt: Date | null;

    constructor(
        letterRecipient: string,
        letterId: string,
        sentAt: Date | null,
    ) {
        this.letterRecipient = letterRecipient;
        this.letterId = letterId;
        this.sentAt = sentAt;
    }

    static dbRowToDbModel(dbRow: any): SentLetter {
        const newSentLetter = new SentLetter(
            dbRow.letter_recipient,
            dbRow.letter_id,
            dbRow.sent_at,
        );
        console.dir(newSentLetter);
        return newSentLetter;
    }

}