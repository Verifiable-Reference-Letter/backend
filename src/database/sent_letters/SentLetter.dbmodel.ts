export class SentLetter {

    recipientAddress: string;
    letterId: string;
    sentAt: Date;

    constructor(
        recipientAddress: string,
        letterId: string,
        sentAt: Date,
    ) {
        this.recipientAddress = recipientAddress;
        this.letterId = letterId;
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