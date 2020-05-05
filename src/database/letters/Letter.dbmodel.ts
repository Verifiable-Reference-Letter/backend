export class Letter {

    letterId: string;
    letterWriterId: string;
    letterRequestorId: string;

    constructor(
        letterId: string,
        letterWriterId: string,
        letterRequestorId: string
    ) {
        this.letterId = letterId;
        this.letterWriterId = letterWriterId;
        this.letterRequestorId = letterRequestorId
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new Letter(
            dbRow.letter_id,
            dbRow.letter_writer_id,
            dbRow.letter_requestor
        );
        return newDbModel;
    }

}