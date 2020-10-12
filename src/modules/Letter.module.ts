import { LetterIdsOnlyDbService } from "../database/letters/LetterIdsOnly.dbservice";
import { UserDbService } from "../database/users/User.dbservice";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { Letter } from "../database/letters/Letter.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { UserRole } from "./UserRole";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";
import { LetterHistoryIdsOnly } from "../database/letter_history/LetterHistoryIdsOnly.dbmodel";
import { LetterHistoryIdsOnlyDbService } from "../database/letter_history/LetterHistoryIdsOnly.dbservice";
import { LetterIdsOnly } from "../database/letters/LetterIdsOnly.dbmodel";

export class LetterModule {
  private userDbService: UserDbService;
  private LetterIdsOnlyDbService: LetterIdsOnlyDbService;
  private sentLetterDbService: SentLetterDbService;
  private letterHistoryIdsOnlyDbService: LetterHistoryIdsOnlyDbService;

  constructor() {
    this.userDbService = new UserDbService();
    this.LetterIdsOnlyDbService = new LetterIdsOnlyDbService();
    this.sentLetterDbService = new SentLetterDbService();
    this.letterHistoryIdsOnlyDbService = new LetterHistoryIdsOnlyDbService();
  }

  async selectAllLettersByWriterAddress(
    publicAddress: string
  ): Promise<Letter[]> {
    const letterIdsOnlyModels: LetterIdsOnly[] = await this.LetterIdsOnlyDbService.selectAllLettersByAddressAndRole(
      publicAddress,
      UserRole.Writer
    );
    console.log(letterIdsOnlyModels);
    return this.transformLetterIdsOnlyToLetters(letterIdsOnlyModels);
  }

  async selectAllLettersByRequestorAddress(
    publicAddress: string
  ): Promise<Letter[]> {
    const letterIdsOnlyModels: LetterIdsOnly[] = await this.LetterIdsOnlyDbService.selectAllLettersByAddressAndRole(
      publicAddress,
      UserRole.Requestor
    );
    console.log(letterIdsOnlyModels);
    return this.transformLetterIdsOnlyToLetters(letterIdsOnlyModels);
  }

  async selectAllLettersByRecipientAddress(
    publicAddress: string
  ): Promise<LetterHistory[]> {
    const LetterHistoryIdsOnlyModels: LetterHistoryIdsOnly[] = await this.letterHistoryIdsOnlyDbService.selectAllLetterHistoryIdsOnlyByLetterRecipient(
      publicAddress
    );
    return this.transformLetterHistoryIdsOnlyToLetterHistory(
      LetterHistoryIdsOnlyModels
    );
  }

  /**
   *
   * @param letterId to get letterHistory of
   */
  async selectAllLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    const LetterHistoryIdsOnlyModels: LetterHistoryIdsOnly[] = await this.letterHistoryIdsOnlyDbService.selectAllLetterHistoryIdsOnlyByLetterId(
      letterId
    );
    return this.transformLetterHistoryIdsOnlyToLetterHistory(
      LetterHistoryIdsOnlyModels
    );
  }

  /**
   * Replace user_ids with User objects
   * @param letterIdsOnly to be transformed into Letter[]
   */
  private async transformLetterIdsOnlyToLetters(
    letterIdsOnly: LetterIdsOnly[]
  ): Promise<Letter[]> {
    console.log("transform");
    console.log(letterIdsOnly.length);
    console.log(letterIdsOnly);
    let letters: Letter[] = [];
    if (letterIdsOnly.length === 0) return letters;
    try {
      const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
        letterIdsOnly[0].letterRequestorId
      );
      const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
        letterIdsOnly[0].letterWriterId
      );
      for (let i = 0; i < letterIdsOnly.length; i++) {
        const l: LetterIdsOnly = letterIdsOnly[i];
        console.log(i);
        console.log(l);
        const newLetter = new Letter(
          l.letterId,
          letterRequestor,
          letterWriter,
          l.requestedAt,
          l.uploadedAt
        );
        letters.push(newLetter);
      }
      console.log(letters);
      return letters;
    } catch (err) {
      console.log(err.stack);
      return letters;
    }
  }

  /**
   * Replace user_ids with User objects
   * @param letterHistoryIdsOnly to be transformed into LetterHistory (for Recipient)
   */
  private async transformLetterHistoryIdsOnlyToLetterHistoryForRecipient(
    letterHistoryIdsOnly: LetterHistoryIdsOnly[]
  ): Promise<LetterHistory[]> {
    let letterHistory: LetterHistory[] = [];
    if (letterHistoryIdsOnly.length === 0) return letterHistory;

    try {
      const letterRecipient: User = await this.userDbService.selectOneRowByPrimaryId(
        letterHistoryIdsOnly[0].letterRecipientId
      );
      for (let i = 0; i < LetterHistoryIdsOnly.length; i++) {
        const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
          letterHistoryIdsOnly[i].letterRequestorId
        );
        const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
          letterHistoryIdsOnly[i].letterWriterId
        );
        const l: LetterHistoryIdsOnly = letterHistoryIdsOnly[i];
        const newLetterHistory = new LetterHistory(
          l.letterId,
          letterRequestor,
          letterWriter,
          l.requestedAt,
          l.uploadedAt,
          letterRecipient,
          l.sentAt
        );
        letterHistory.push(newLetterHistory);
      }
    } catch (err) {
      console.log(err.stack);
    }
    return letterHistory;
  }

  /**
   * Replace user_ids with User objects
   * @param letterHistoryIdsOnly to be transformed into LetterHistory[]
   */
  private async transformLetterHistoryIdsOnlyToLetterHistory(
    letterHistoryIdsOnly: LetterHistoryIdsOnly[]
  ): Promise<LetterHistory[]> {
    let letterHistory: LetterHistory[] = [];
    if (letterHistoryIdsOnly.length === 0) return letterHistory;
    try {
      const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
        letterHistoryIdsOnly[0].letterRequestorId
      );
      const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
        letterHistoryIdsOnly[0].letterWriterId
      );
      for (let i = 0; i < LetterHistoryIdsOnly.length; i++) {
        const letterRecipient: User = await this.userDbService.selectOneRowByPrimaryId(
          letterHistoryIdsOnly[i].letterRecipientId
        );
        const l: LetterHistoryIdsOnly = letterHistoryIdsOnly[i];
        const newLetterHistory = new LetterHistory(
          l.letterId,
          letterRequestor,
          letterWriter,
          l.requestedAt,
          l.uploadedAt,
          letterRecipient,
          l.sentAt
        );
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

  // private async transformSentLettersToLetterRecipients(sentLetters: SentLetter[]): Promise<User[]> {
  //     const letterRecipientsPromise: Promise<User[]> = Promise.all(sentLetters.map(async (sentLetter) => {
  //         return await this.usersDbService.selectOneRowByPrimaryId(sentLetter.recipientAddress);
  //     }));
  //     return letterRecipientsPromise;
  // }
}
