"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SentLetter {
    constructor(letterRecipient, letterId, sentAt) {
        this.letterRecipient = letterRecipient;
        this.letterId = letterId;
        this.sentAt = sentAt;
    }
    static dbRowToDbModel(dbRow) {
        const newSentLetter = new SentLetter(dbRow.letter_recipient, dbRow.letter_id, dbRow.sent_at);
        console.dir(newSentLetter);
        return newSentLetter;
    }
}
exports.SentLetter = SentLetter;
//# sourceMappingURL=SentLetter.dbmodel.js.map