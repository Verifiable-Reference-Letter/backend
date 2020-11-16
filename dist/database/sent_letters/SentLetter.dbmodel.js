"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SentLetter {
    constructor(letterRecipient, letterId, sentAt, letterContents, letterSignature) {
        this.letterRecipient = letterRecipient;
        this.letterId = letterId;
        this.sentAt = sentAt;
        if (letterContents !== null) {
            this.letterContents = letterContents.toString("utf8");
        }
        else {
            this.letterContents = null;
        }
        this.letterSignature = letterSignature;
    }
    static dbRowToDbModel(dbRow) {
        const newSentLetter = new SentLetter(dbRow.letter_recipient, dbRow.letter_id, dbRow.sent_at, dbRow.letter_contents, dbRow.letter_signature);
        console.dir(newSentLetter);
        return newSentLetter;
    }
}
exports.SentLetter = SentLetter;
//# sourceMappingURL=SentLetter.dbmodel.js.map