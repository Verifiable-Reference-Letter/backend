import { LetterDbService } from "../database/letters/Letter.dbservice";
import { UsersDbService } from "../database/users/User.dbservice";
import { LetterHistory } from "../database/letter_history/LetterHistory.model";
import { Letter } from "../database/letters/Letter.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { UserRole } from "./UserRole";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";
import { LetterHistoryIdsOnly } from "../database/letter_history/LetterHistoryIdsOnly.model";
import { LetterHistoryIdsOnlyDbService } from "../database/letter_history/LetterHistoryIdsOnly.dbservice";

export class LetterModule {

    private usersDbService: UsersDbService;
    private letterDbService: LetterDbService;
    private sentLetterDbService: SentLetterDbService;
    private letterHistoryIdsOnlyDbService: LetterHistoryIdsOnlyDbService;

    constructor() {
        this.usersDbService = new UsersDbService();
        this.letterDbService = new LetterDbService();
        this.sentLetterDbService = new SentLetterDbService();
        this.letterHistoryIdsOnlyDbService = new LetterHistoryIdsOnlyDbService();
    }

    async selectAllLetterHistoryByLetterId(letterId: string): Promise<LetterHistory[]> {
        const LetterHistoryIdsOnly: LetterHistoryIdsOnly[] = await this.letterHistoryIdsOnlyDbService.selectAllLetterHistoryIdsOnlyByLetterId(letterId);
        return this.transformLetterHistoryIdsOnlyToLetterHistory(LetterHistoryIdsOnly);
    }

    // Change to use altered ReceivedLetterHistory model that excludes recipients list
    // async selectAllSentLetterHistoryByRecipientAddress(address: string): Promise<LetterHistory[]> {
    //     const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Recipient);
    //     return this.transformLetterRowToLetterHistory(sentLetterModels, address, UserRole.Recipient);
    // }

    // async selectAllSentLetterHistoryByWriterAddress(address: string): Promise<LetterHistory[]> {
    //     const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Writer);
    //     return this.transformLetterRowToLetterHistory(sentLetterModels, address, UserRole.Writer);
    // }

    // async selectAllSentLetterHistoryByRequestorAddress(address: string): Promise<LetterHistory[]> {
    //     const sentLetterModels: Letter[] = await this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole.Requestor);
    //     return this.transformLetterRowToLetterHistory(sentLetterModels, address, UserRole.Requestor);
    // }

    private async transformLetterHistoryIdsOnlyToLetterHistory(letterHistoryIdsOnly: LetterHistoryIdsOnly[]): Promise<LetterHistory[]> {
        let letterHistory: LetterHistory[] = [];
        if (letterHistoryIdsOnly.length === 0 ) return letterHistory;
        try {
            const letterRequestor: User = await this.usersDbService.selectOneRowByPrimaryId(letterHistoryIdsOnly[0].letterRequestorId);
            const letterWriter: User = await this.usersDbService.selectOneRowByPrimaryId(letterHistoryIdsOnly[0].letterWriterId);
            for (let i = 0; i < LetterHistoryIdsOnly.length; i++) {
                const letterRecipient: User = await this.usersDbService.selectOneRowByPrimaryId(letterHistoryIdsOnly[0].letterRecipientId);
                const l: LetterHistoryIdsOnly = letterHistoryIdsOnly[i];
                const newLetterHistory = new LetterHistory(
                    l.letterId,
                    letterRequestor,
                    letterWriter,
                    l.requestedAt,
                    l.uploadedAt,
                    letterRecipient,
                    l.sentAt,
                )
                letterHistory.push(newLetterHistory);
            }
        } catch (err) {
            console.log(err.stack);
        }
        return letterHistory;
    }
        // const LetterHistoryPromise: Promise<LetterHistory[]> = Promise.all(LetterHistoryModels).then((result) => {
        //     return result;
        // });
        // return LetterHistoryPromise;

    private async transformSentLettersToLetterRecipients(sentLetters: SentLetter[]): Promise<User[]> {
        const letterRecipientsPromise: Promise<User[]> = Promise.all(sentLetters.map(async (sentLetter) => {
            return await this.usersDbService.selectOneRowByPrimaryId(sentLetter.recipientAddress);
        }));
        return letterRecipientsPromise;
    }

}