import { User } from "../database/users/User.dbmodel";

export class LetterDetails {

    letterId: string;
    letterWriter: User;
    letterRequestor: User;
    letterRecipients: User[];

    constructor(
        letterId: string,
        letterWriter: User,
        letterRequestor: User,
        letterRecipients: User[]
    ) {
        this.letterId = letterId;
        this.letterWriter = letterWriter;
        this.letterRequestor = letterRequestor;
        this.letterRecipients = letterRecipients;
    }

}