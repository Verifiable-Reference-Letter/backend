export class SentLetter {

    recipientId: string;
    letterId: string;

    constructor(
        recipientId: string,
        letterId: string
    ) {
        this.recipientId = recipientId;
        this.letterId = letterId;
    }

    static dbRowToDbModel(dbRow: any): SentLetter {
        const newSentLetter = new SentLetter(
            dbRow.user_id,
            dbRow.letter_id
        );
        console.dir(newSentLetter);
        return newSentLetter;
    }

}