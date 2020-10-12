export class SentLetter {

    recipientAddress: string;
    letterId: string;
    sentAt: Date | null;

    constructor(
        recipientAddress: string,
        letterId: string,
        sentAt: Date | null,
    ) {
        this.recipientAddress = recipientAddress;
        this.letterId = letterId;
        this.sentAt = sentAt;
    }

    static dbRowToDbModel(dbRow: any): SentLetter {
        const newSentLetter = new SentLetter(
            dbRow.public_address,
            dbRow.letter_id,
            dbRow.sentAt,
        );
        console.dir(newSentLetter);
        return newSentLetter;
    }

}