import { LetterDbService } from "../database/letters/Letter.dbservice";
import { UsersDbService } from "../database/users/User.dbservice";
import { LetterDetails } from "./LetterDetails.model";
import { Letter } from "../database/letters/Letter.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { UserRole } from "./UserRole";

// const usersDbService = new UsersDbService();
// const letterDbService = new LetterDbService();

export class LetterModule {

    usersDbService: UsersDbService;
    letterDbService: LetterDbService;

    constructor() {
        this.usersDbService = new UsersDbService();
        this.letterDbService = new LetterDbService();
    }

    async selectAllSentLetterDetailsByRecipientId(userId: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByUserIdAndRole(userId, UserRole.Recipient);
        return this.transformLetterRowToLetterDetails(sentLetterModels);
    }

    async selectAllSentLetterDetailsByWriterId(userId: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByUserIdAndRole(userId, UserRole.Writer);
        return this.transformLetterRowToLetterDetails(sentLetterModels);
    }

    async selectAllSentLetterDetailsByRequestorId(userId: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByUserIdAndRole(userId, UserRole.Requestor);
        return this.transformLetterRowToLetterDetails(sentLetterModels);
    }

    private async transformLetterRowToLetterDetails(sentLetterModels: Letter[]): Promise<LetterDetails[]> {
        const letterDetailsModels = sentLetterModels.map(async (letter) => {
            try {
                const letterWriter: User = await this.usersDbService.selectOneRowByPrimaryId(letter.letterWriterId);
                const letterRequestor: User = await this.usersDbService.selectOneRowByPrimaryId(letter.letterRequestorId);
                const letterRecipient: User = await this.usersDbService.selectOneRowByPrimaryId(letter.letterRecipientId);
                const newLetterDetails = new LetterDetails(
                    letter.letterId,
                    letterWriter,
                    letterRequestor,
                    letterRecipient
                );
                return newLetterDetails;

            } catch (err) {
                console.log(err.stack);
            }
        });
        const letterDetailsPromise: Promise<LetterDetails[]> = Promise.all(letterDetailsModels).then((result) => {
            return result;
        });
        return letterDetailsPromise;
    }

}