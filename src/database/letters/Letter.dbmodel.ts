export class Letter {

    letterId: string;
    letterWriter: string;
    letterRequestor: string;
    requestedAt: Date;
    uploadedAt: Date;

    constructor(
        letterId: string,
        letterWriter: string,
        letterRequestor: string,
        requestedAt: Date,
        uploadedAt: Date,
    ) {
        this.letterId = letterId;
        this.letterWriter = letterWriter;
        this.letterRequestor = letterRequestor
        this.requestedAt = requestedAt;
        this.uploadedAt = uploadedAt;
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new Letter(
            dbRow.letter_id,
            dbRow.letter_writer,
            dbRow.letter_requestor,
            dbRow.requestedAt,
            dbRow.uploadedAt,
        );
        return newDbModel;
    }
}