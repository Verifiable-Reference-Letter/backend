import { User } from "../users/User.dbmodel";

export class LetterHistory {

    letterId: string;
    letterRequestor: User;
    letterWriter: User;
    requestedAt: Date;
    uploadedAt: Date;
    letterRecipient: User;
    sentAt: Date;

    constructor(
        letterId: string,
        letterRequestor: User,
        letterWriter: User,
        requestedAt: Date,
        uploadedAt: Date,
        letterRecipient: User,
        sentAt: Date,
    ) {
        this.letterId = letterId;
        this.letterRequestor = letterRequestor;
        this.letterWriter = letterWriter;
        this.requestedAt = requestedAt;
        this.uploadedAt = uploadedAt;
        this.letterRecipient = letterRecipient;
        this.sentAt = sentAt;
    }

}