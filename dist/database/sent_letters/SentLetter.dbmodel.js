"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SentLetter {
    constructor(recipientAddress, letterId) {
        this.recipientAddress = recipientAddress;
        this.letterId = letterId;
    }
    static dbRowToDbModel(dbRow) {
        const newSentLetter = new SentLetter(dbRow.public_address, dbRow.letter_id);
        console.dir(newSentLetter);
        return newSentLetter;
    }
}
exports.SentLetter = SentLetter;
//# sourceMappingURL=SentLetter.dbmodel.js.map