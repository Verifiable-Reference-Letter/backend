export class Letter {

    letterId: string;
    letterWriter: string;
    letterRequestor: string;

    constructor(
        letterId: string,
        letterWriter: string,
        letterRequestor: string,
    ) {
        this.letterId = letterId;
        this.letterWriter = letterWriter;
        this.letterRequestor = letterRequestor
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new Letter(
            dbRow.letter_id,
            dbRow.letter_writer,
            dbRow.letter_requestor,
        );
        return newDbModel;
    }

}