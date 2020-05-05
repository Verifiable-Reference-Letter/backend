export class Letter {

    letterId: string;
    letterWriterId: string;
    letterRequestorId: string;
    letterRecipientId: string;

    constructor(
        letterId: string,
        letterWriterId: string,
        letterRequestorId: string,
        letterRecipientId: string
    ) {
        this.letterId = letterId;
        this.letterWriterId = letterWriterId;
        this.letterRequestorId = letterRequestorId
        this.letterRecipientId = letterRecipientId
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new Letter(
            dbRow.letter_id,
            dbRow.letter_writer_id,
            dbRow.letter_requestor,
            dbRow.user_id
        );
        return newDbModel;
    }

}