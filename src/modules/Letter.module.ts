import { LetterDbService } from "../database/letters/Letter.dbservice";
import { UsersDbService } from "../database/users/User.dbservice";
import { LetterDetails } from "./LetterDetails.model";
import { Letter } from "../database/letters/Letter.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { UserRole } from "./UserRole";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";

export class LetterModule {

    private usersDbService: UsersDbService;
    private letterDbService: LetterDbService;
    private sentLetterDbService: SentLetterDbService;

    constructor() {
        this.usersDbService = new UsersDbService();
        this.letterDbService = new LetterDbService();
        this.sentLetterDbService = new SentLetterDbService();
    }

    // Change to use altered ReceivedLetterDetails model that excludes recipients list
    async selectAllSentLetterDetailsByRecipientAddress(address: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Recipient);
        return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole.Recipient);
    }

    async selectAllSentLetterDetailsByWriterAddress(address: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Writer);
        return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole.Writer);
    }

    async selectAllSentLetterDetailsByRequestorAddress(address: string): Promise<LetterDetails[]> {
        const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Requestor);
        return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole.Requestor);
    }

    private async transformLetterRowToLetterDetails(
        letterModels: Letter[],
        userId: string,
        userRole: UserRole
    ): Promise<LetterDetails[]> {
        const letterDetailsModels = letterModels.map(async (letter) => {
            try {
                const letterWriter: User = await this.usersDbService.selectOneRowByPrimaryId(letter.letterWriterId);
                const letterRequestor: User = await this.usersDbService.selectOneRowByPrimaryId(letter.letterRequestorId);

                const sentLetters: SentLetter[] = await this.sentLetterDbService.selectAllSentLettersByLetterId(letter.letterId);
                const letterRecipients: User[] = await this.transformSentLettersToLetterRecipients(sentLetters);

                const newLetterDetails = new LetterDetails(
                    letter.letterId,
                    letterWriter,
                    letterRequestor,
                    letterRecipients
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

    private async transformSentLettersToLetterRecipients(sentLetters: SentLetter[]): Promise<User[]> {
        const letterRecipientsPromise: Promise<User[]> = Promise.all(sentLetters.map(async (sentLetter) => {
            return await this.usersDbService.selectOneRowByPrimaryId(sentLetter.recipientId);
        }));
        return letterRecipientsPromise;
    }

}