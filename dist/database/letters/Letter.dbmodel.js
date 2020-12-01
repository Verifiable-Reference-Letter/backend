"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_dbmodel_1 = require("../users/User.dbmodel");
class Letter {
    constructor(letterId, letterRequestorId, letterRequestorName, letterWriterId, letterWriterName, requestedAt, uploadedAt) {
        this.letterId = letterId;
        this.letterRequestor = new User_dbmodel_1.User(letterRequestorId, letterRequestorName);
        this.letterWriter = new User_dbmodel_1.User(letterWriterId, letterWriterName);
        this.requestedAt = requestedAt;
        this.uploadedAt = uploadedAt;
    }
    static dbRowToDbModel(dbRow) {
        const newDbModel = new Letter(dbRow.letter_id, dbRow.letter_requestor, dbRow.letter_requestor_name, dbRow.letter_writer, dbRow.letter_writer_name, dbRow.requested_at, dbRow.uploaded_at ? new Date(dbRow.uploaded_at) : dbRow.uploaded_at);
        return newDbModel;
    }
}
exports.Letter = Letter;
//# sourceMappingURL=Letter.dbmodel.js.map