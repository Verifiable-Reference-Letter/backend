import { User } from "../users/User.dbmodel";

export class Letter {

    letterId: string;
    letterRequestor: User;
    letterWriter: User;
    requestedAt: Date;
    uploadedAt: Date;

    constructor(
        letterId: string,
        letterRequestor: User,
        letterWriter: User,
        requestedAt: Date,
        uploadedAt: Date,
    ) {
        this.letterId = letterId;
        this.letterRequestor = letterRequestor;
        this.letterWriter = letterWriter;
        this.requestedAt = requestedAt;
        this.uploadedAt = uploadedAt;
    }

    static dbRowToDbModel(dbRow: any) {
        const newDbModel = new Letter(
            dbRow.letter_id,
            dbRow.letter_requestor,
            dbRow.letter_writer,
            dbRow.requested_at,
            dbRow.uploaded_at ? new Date(dbRow.uploaded_at) : dbRow.uploaded_at,
        );
        return newDbModel;
    }
}