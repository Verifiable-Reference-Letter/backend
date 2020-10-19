import { LetterDbService } from "../database/letters/Letter.dbservice";
import { UserDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
import { UserRole } from "./UserRole";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { LetterHistoryDbService } from "../database/letter_history/LetterHistory.dbservice";
import { Letter } from "../database/letters/Letter.dbmodel";

export class LetterModule {
  private userDbService: UserDbService;
  private LetterDbService: LetterDbService;
  private sentLetterDbService: SentLetterDbService;
  private letterHistoryDbService: LetterHistoryDbService;

  constructor() {
    this.userDbService = new UserDbService();
    this.LetterDbService = new LetterDbService();
    this.sentLetterDbService = new SentLetterDbService();
    this.letterHistoryDbService = new LetterHistoryDbService();
  }

  async selectAllLettersByWriterAddress(
    publicAddress: string
  ): Promise<Letter[]> {
    console.log("selectAllLettersByWriterAddress");
    const letterModels: Letter[] = await this.LetterDbService.selectAllLettersByAddressAndRole(
      publicAddress,
      UserRole.Writer
    );
    console.log(letterModels);
    return letterModels;
  }

  async selectAllLettersByRequestorAddress(
    publicAddress: string
  ): Promise<Letter[]> {
    console.log("selectAllLettersByRequestorAddress");
    const letterModels: Letter[] = await this.LetterDbService.selectAllLettersByAddressAndRole(
      publicAddress,
      UserRole.Requestor
    );
    console.log(letterModels);
    return letterModels;
  }

  async selectAllLettersByRecipientAddress(
    publicAddress: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLettersByRecipientAddress");
    const letterHistoryModels: LetterHistory[] = await this.letterHistoryDbService.selectAllLetterHistoryByLetterRecipient(
      publicAddress
    );
    return letterHistoryModels;
  }

  /**
   *
   * @param letterId to get letterHistory of
   */
  async selectAllLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLetterHistoryByLetterId");
    const letterHistoryModels: LetterHistory[] = await this.letterHistoryDbService.selectAllLetterHistoryByLetterId(
      letterId
    );
    console.log(letterHistoryModels);
    return letterHistoryModels;
  }

  // /**
  //  * Replace user_ids with User objects
  //  * @param letter to be transformed into Letter[]
  //  */
  // private async transformLetterToLetters(
  //   letter: Letter[]
  // ): Promise<Letter[]> {
  //   console.log("transformLetterToLetters");
  //   console.log(letter.length);
  //   console.log(letter);
  //   let letters: Letter[] = [];
  //   if (letter.length === 0) return letters;
  //   try {
  //     for (let i = 0; i < letter.length; i++) {
  //       const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
  //         letter[i].letterRequestorId
  //       );
  //       const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
  //         letter[i].letterWriterId
  //       );
  //       const l: Letter = letter[i];
  //       console.log(i);
  //       console.log(l);
  //       const newLetter = new Letter(
  //         l.letterId,
  //         letterRequestor,
  //         letterWriter,
  //         l.requestedAt,
  //         l.uploadedAt
  //       );
  //       letters.push(newLetter);
  //     }
  //     console.log(letters);
  //     return letters;
  //   } catch (err) {
  //     console.log(err.stack);
  //     return letters;
  //   }
  // }

  // /**
  //  * Replace user_ids with User objects
  //  * @param letterHistory to be transformed into LetterHistory (for Recipient)
  //  */
  // private async transformLetterHistoryToLetterHistoryForRecipient(
  //   letterHistory: LetterHistory[]
  // ): Promise<LetterHistory[]> {
  //   console.log("transformLetterHistoryToLetterHistoryForRecipient");
  //   console.log(letterHistory.length);
  //   console.log(letterHistory);

  //   let letterHistory: LetterHistory[] = [];
  //   if (letterHistory.length === 0) return letterHistory;
  //   if (!letterHistory[0]) return letterHistory;

  //   try {
  //     const letterRecipient: User = await this.userDbService.selectOneRowByPrimaryId(
  //       letterHistory[0].letterRecipientId
  //     );
  //     for (let i = 0; i < letterHistory.length; i++) {
  //       const l: LetterHistory = letterHistory[i];
  //       const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
  //         l.letterRequestorId
  //       );
  //       const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
  //         l.letterWriterId
  //       );
  //       const newLetterHistory = new LetterHistory(
  //         l.letterId,
  //         letterRequestor,
  //         letterWriter,
  //         l.requestedAt,
  //         l.uploadedAt,
  //         letterRecipient,
  //         l.sentAt
  //       );
  //       letterHistory.push(newLetterHistory);
  //     }
  //     return letterHistory;
  //   } catch (err) {
  //     console.log(err.stack);
  //     return letterHistory;
  //   }
  // }

  // /**
  //  * Replace user_ids with User objects
  //  * @param letterHistory to be transformed into LetterHistory[]
  //  */
  // private async transformLetterHistoryToLetterHistory(
  //   letterHistory: LetterHistory[]
  // ): Promise<LetterHistory[]> {
  //   console.log("transformLetterHistoryToLetterHistory");
  //   console.log(letterHistory);
  //   let letterHistory: LetterHistory[] = [];
  //   if (letterHistory.length === 0) return letterHistory;
  //   try {
  //     const letterRequestor: User = await this.userDbService.selectOneRowByPrimaryId(
  //       letterHistory[0].letterRequestorId
  //     );
  //     const letterWriter: User = await this.userDbService.selectOneRowByPrimaryId(
  //       letterHistory[0].letterWriterId
  //     );
  //     for (let i = 0; i < LetterHistory.length; i++) {
  //       const letterRecipient: User = await this.userDbService.selectOneRowByPrimaryId(
  //         letterHistory[i].letterRecipientId
  //       );
  //       const l: LetterHistory = letterHistory[i];
  //       const newLetterHistory = new LetterHistory(
  //         l.letterId,
  //         letterRequestor,
  //         letterWriter,
  //         l.requestedAt,
  //         l.uploadedAt,
  //         letterRecipient,
  //         l.sentAt
  //       );
  //       letterHistory.push(newLetterHistory);
  //     }
  //     return letterHistory;
  //   } catch (err) {
  //     console.log(err.stack);
  //     return letterHistory;
  //   }
  // }

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
