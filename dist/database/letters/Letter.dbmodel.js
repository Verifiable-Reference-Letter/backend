"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Letter {
    constructor(letterId, letterWriter, letterRequestor) {
        this.letterId = letterId;
        this.letterWriter = letterWriter;
        this.letterRequestor = letterRequestor;
    }
    static dbRowToDbModel(dbRow) {
        const newDbModel = new Letter(dbRow.letter_id, dbRow.letter_writer, dbRow.letter_requestor);
        return newDbModel;
    }
}
exports.Letter = Letter;
//# sourceMappingURL=Letter.dbmodel.js.map