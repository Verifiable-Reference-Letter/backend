export class SentLetter {

    recipientAddress: string;
    letterId: string;

    constructor(
        recipientAddress: string,
        letterId: string
    ) {
        this.recipientAddress = recipientAddress;
        this.letterId = letterId;
    }

    static dbRowToDbModel(dbRow: any): SentLetter {
        const newSentLetter = new SentLetter(
            dbRow.public_address,
            dbRow.letter_id
        );
        console.dir(newSentLetter);
        return newSentLetter;
    }

}