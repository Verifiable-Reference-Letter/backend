"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SentLetter {
    constructor(recipientAddress, letterId, sentAt) {
        this.recipientAddress = recipientAddress;
        this.letterId = letterId;
        this.sentAt = sentAt;
    }
    static dbRowToDbModel(dbRow) {
        const newSentLetter = new SentLetter(dbRow.public_address, dbRow.letter_id, dbRow.sentAt);
        console.dir(newSentLetter);
        return newSentLetter;
    }
}
exports.SentLetter = SentLetter;
//# sourceMappingURL=SentLetter.dbmodel.js.map