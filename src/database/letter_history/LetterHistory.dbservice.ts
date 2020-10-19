import { DatabaseService } from "../dbservice";
import { LetterHistory } from "./LetterHistory.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterHistoryDbService extends DatabaseService<LetterHistory> {
  constructor() {
    super();
  }

  /**
   *
   * @param publicAddress of the letter_recipient
   */
  async selectAllLetterHistoryByLetterRecipient(
    publicAddress: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLetterHistoryByLetterRecipient");
    const queryText = this.selectAllLetterHistoryByLetterRecipientQuery;
    const values = [publicAddress];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * @param letterId letter_id to get letter history for (ids only)
   */
  async selectAllLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLetterHistoryByLetterId");
    const queryText = this.selectAllLetterHistoryByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * @param letterId letter_id to get letter history for (ids only)
   */
  async selectAllSentLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLetterHistoryByLetterId");
    const queryText = this.selectAllSentLetterHistoryByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * @param letterId letter_id to get letter history for (ids only)
   */
  async selectAllUnsentLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    console.log("selectAllLetterHistoryByLetterId");
    const queryText = this.selectAllUnsentLetterHistoryByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  async countRecipientsByLetterId(letterId: string): Promise<Number> {
    console.log("countRecipientsByLetterId");
    const queryText = this.countRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayCount(queryText, values);
  }

  // async selectAllLettersByAddressAndRole(address: string, userRole: UserRole): Promise<Letter[]> {
  //     const queryText = this.getQueryTextByUserRole(userRole);
  //     const values = [address];
  //     return super.runParameterizedQueryWithValuesArray(queryText, values);
  // }

  // private getQueryTextByUserRole(userRole: UserRole): any {
  //     if (userRole.valueOf() === UserRole.Recipient.valueOf()) {
  //         return this.selectAllLettersByRecipientIdQuery;
  //     }
  //     else if (userRole.valueOf() === UserRole.Requestor.valueOf()) {
  //         return this.selectAllLettersByRequestorIdQuery;
  //     }
  //     else if (userRole.valueOf() === UserRole.Writer.valueOf()) {
  //         return this.selectAllLettersByWriterIdQuery;
  //     }
  // }

  // private selectAllLetterHistoryByLetterRecipientQuery = {
  //     text: "select L.letter_id, letter_writer, letter_requestor, requested_at, uploaded_at, letter_recipient, sent_at from " + letterTableName + " as L inner join " + sentLetterTableName + " as S on L.letter_id = S.letter_id where S.letter_recipient = $1;"
  // }

  // private selectAllLetterHistoryByLetterIdQuery = {
  //     text: "select L.letter_id, letter_writer, letter_requestor, requested_at, uploaded_at, letter_recipient, sent_at from " + letterTableName + " as L inner join " + sentLetterTableName + " as S on L.letter_id = S.letter_id where L.letter_id = $1;"
  // }

  private selectAllLetterHistoryByLetterRecipientQuery = {
    text:
      "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where S.letter_recipient = $1;",
  };

  private selectAllLetterHistoryByLetterIdQuery = {
    text:
      "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1;",
  };

  private selectAllSentLetterHistoryByLetterIdQuery = {
    text:
      "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is not NULL;",
  };

  private selectAllUnsentLetterHistoryByLetterIdQuery = {
    text:
      "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL;",
  };

  private countRecipientsByLetterIdQuery = {
    text: "select * from " + sentLetterTableName + " where letter_id = $1;",
  };

  protected dbRowToDbModel(dbRow: any): LetterHistory {
    return LetterHistory.dbRowToDbModel(dbRow);
  }
}
