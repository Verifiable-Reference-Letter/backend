import { DatabaseService } from "../dbservice";
import { LetterHistory } from "./LetterHistory.dbmodel";
import { User } from "../users/User.dbmodel";

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

  /**
   * @param letterId letter_id to get letter history for (ids only)
   */
  async selectAllUnsentRecipientsByLetterId(letterId: string): Promise<User[]> {
    console.log("selectAllLetterHistoryByLetterId");
    const queryText = this.selectAllUnsentRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayUser(queryText, values);
  }

  async countRecipientsByLetterId(letterId: string): Promise<Number> {
    console.log("countRecipientsByLetterId");
    const queryText = this.countRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayCount(queryText, values);
  }

  async updateRecipientsByLetterId(letterId: string, recipients: User[]): Promise<boolean> {
    console.log("updateRecipientsByLetterId");
    const deleteQueryText = this.deletePreviousRecipientsByLetterId;
    const deleteValues = [letterId];
    const successfulDelete: boolean = await super.runParameterizedQueryWithValuesArrayDelete(deleteQueryText, deleteValues);
    console.log("successfulDelete", successfulDelete);
    if (!successfulDelete) return false;
    for (let i = 0; i < recipients.length; i++) {
      console.log(i, recipients[i]);
      const insertQueryText = this.insertRecipientByLetterId;
      const insertValues = [recipients[i].publicAddress, letterId];
      const successfulInsert: boolean = await super.runParameterizedQueryWithValuesArrayInsert(insertQueryText, insertValues);
      console.log("successfulInsert", successfulInsert);
      if (!successfulInsert) return false;
    }
    return true;
  }

  private selectAllLetterHistoryByLetterRecipientQuery = {
    text:
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
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
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
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
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
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
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
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

  private selectAllUnsentRecipientsByLetterIdQuery = {
    text:
      "select distinct W.public_address, W.name from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL;",
  };

  private countRecipientsByLetterIdQuery = {
    text: "select * from " + sentLetterTableName + " where letter_id = $1;",
  };

  private deletePreviousRecipientsByLetterId = {
    text: "delete from " + sentLetterTableName + " where letter_id = $1 and sent_at is null;"
  }

  private insertRecipientByLetterId = {
    text: "insert into " + sentLetterTableName + "(letter_recipient, letter_id, sent_at) values($1, $2, null);"
  }

  protected dbRowToDbModel(dbRow: any): LetterHistory {
    return LetterHistory.dbRowToDbModel(dbRow);
  }
}
