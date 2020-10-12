import { User } from "../users/User.dbmodel";

export class LetterHistory {

    letterId: string;
    letterRequestor: User;
    letterWriter: User;
    requestedAt: Date;
    uploadedAt: Date | null;
    letterRecipient: User;
    sentAt: Date | null;

    constructor(
        letterId: string,
        letterRequestor: User,
        letterWriter: User,
        requestedAt: Date,
        uploadedAt: Date | null,
        letterRecipient: User,
        sentAt: Date | null,
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