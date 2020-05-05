import { User } from "../database/users/User.dbmodel";

export class LetterDetails {

    letterId: string;
    letterWriter: User;
    letterRequestor: User;
    letterRecipient: User;

    constructor(
        letterId: string,
        letterWriter: User,
        letterRequestor: User,
        letterRecipient: User
    ) {
        this.letterId = letterId;
        this.letterWriter = letterWriter;
        this.letterRequestor = letterRequestor;
        this.letterRecipient = letterRecipient;
    }

}