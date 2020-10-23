import { DatabaseService } from "../dbservice";
import { LetterHistory } from "./LetterHistory.dbmodel";
import { LetterContents } from "../letter_contents/LetterContents.dbmodel";
import { User } from "../users/User.dbmodel";
import { UserKey } from "../users/UserKey.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterHistoryDbService extends DatabaseService<LetterHistory> {
  constructor() {
    super();
  }

  /**
   * retrieval of letters for recipient's page
   * @param publicAddress of the letter recipient
   */
  async selectAllLetterHistoryByLetterRecipient(
    publicAddress: string
  ): Promise<LetterHistory[]> {
    // console.log("selectAllLetterHistoryByLetterRecipient");
    const queryText = this.selectAllLetterHistoryByLetterRecipientQuery;
    const values = [publicAddress];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * unsent and sent history
   * retrieval of all letter history for a given letter id (for either requestor or writer)
   * includes both unsent and sent letter history
   * @param letterId letter id to get letter history
   */
  // async selectAllLetterHistoryByLetterId(
  //   letterId: string
  // ): Promise<LetterHistory[]> {
  //   // console.log("selectAllLetterHistoryByLetterId");
  //   const queryText = this.selectAllLetterHistoryByLetterIdQuery;
  //   const values = [letterId];
  //   return super.runParameterizedQueryWithValuesArray(queryText, values);
  // }

  /**
   * sent history
   * retrieval of all sent letter history for a given letter id (for either requestor or writer)
   * @param letterId
   */
  async selectAllSentLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    // console.log("selectAllLetterHistoryByLetterId");
    const queryText = this.selectAllSentLetterHistoryByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * unsent history
   * retrieval of all unsent letter history for a given letter id (for either requestor or writer)
   * @param letterId
   */
  async selectAllUnsentLetterHistoryByLetterId(
    letterId: string
  ): Promise<LetterHistory[]> {
    const queryText = this.selectAllUnsentLetterHistoryByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * unsent recipients
   * retrieval of all unsent letter recipients (Users) rather than full letter history
   * for a given letter id (for either requestor or writer)
   * @param letterId
   */
  async selectAllUnsentRecipientsByLetterId(letterId: string): Promise<User[]> {
    const queryText = this.selectAllUnsentRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayUser(queryText, values);
  }

  /**
   * unsent recipient keys
   * retrieval of all unsent letter recipients keys (UserKeys) rather than full letter history
   * for a given letter id (for either requestor or writer)
   * @param letterId
   */
  async selectAllUnsentRecipientKeysByLetterId(
    letterId: string
  ): Promise<UserKey[]> {
    const queryText = this.selectAllUnsentRecipientKeyByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayUserKey(queryText, values);
  }

  /**
   * # sent recipients
   * count the number of sent recipients for a given letter id
   * useful for letter displays
   * @param letterId
   */
  async countSentRecipientsByLetterId(letterId: string): Promise<Number> {
    const queryText = this.countSentRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayCount(queryText, values);
  }

  /**
   * # unsent recipients
   * count the number of unsent recipients for a given letter id
   * useful for letter displays
   * @param letterId
   */
  async countUnsentRecipientsByLetterId(letterId: string): Promise<Number> {
    const queryText = this.countUnsentRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArrayCount(queryText, values);
  }

  /**
   * update recipients list for a given letter id (for requestor page)
   * currently deletes previous recipients by letter id and inserts new
   * rather than comparing new and old lists
   * @param letterId
   * @param recipients list of new recipients
   */
  async updateRecipientsByLetterId(
    letterId: string,
    recipients: User[]
  ): Promise<boolean> {
    const deleteQueryText = this.deletePreviousRecipientsByLetterIdQuery;
    const deleteValues = [letterId];
    const successfulDelete: boolean = await super.runParameterizedQueryWithValuesArrayDelete(
      deleteQueryText,
      deleteValues
    );
    if (!successfulDelete) return false;
    for (let i = 0; i < recipients.length; i++) {
      const selectQueryText = this
        .selectAllLetterHistoryByLetterIdAndRecipientIdQuery;
      const selectValues = [letterId, recipients[i].publicAddress];
      const successfulSelect: LetterHistory[] = await super.runParameterizedQueryWithValuesArray(
        selectQueryText,
        selectValues
      );
      if (successfulSelect && successfulSelect.length > 0) {
        continue;
        // TODO: should return error notifying user that can't add recipient already sent to
        // Then again, this shouldn't be allowed to happen on the frontend
      }

      const insertQueryText = this.insertRecipientByLetterIdQuery;
      const insertValues = [recipients[i].publicAddress, letterId];
      const successfulInsert: boolean = await super.runParameterizedQueryWithValuesArrayInsert(
        insertQueryText,
        insertValues
      );
      if (!successfulInsert) return false;
    }
    return true;
  }

  /**
   * insert new recipients for a letter id
   * for when new letter request is made (with indicated list of recipients)
   * @param letterId
   * @param recipients
   */
  async insertRecipientsByLetterId(
    letterId: string,
    recipients: User[]
  ): Promise<boolean> {
    for (let i = 0; i < recipients.length; i++) {
      const insertQueryText = this.insertRecipientByLetterIdQuery;
      const insertValues = [recipients[i].publicAddress, letterId];
      const successfulInsert: boolean = await super.runParameterizedQueryWithValuesArrayInsert(
        insertQueryText,
        insertValues
      );
      if (!successfulInsert) return false;
    }
    return true;
  }

  /**
   * retrieve letter contents by letter id and recipient id
   * @param letterId 
   * @param letterRecipient 
   */
  async selectLetterContentsByLetterIdAndRecipientId(
    letterId: string,
    letterRecipient: string
  ): Promise<LetterContents[]> {
    const queryText = this.selectLetterContentsByLetterIdAndRecipientIdQuery;
    const values = [letterId, letterRecipient];
    return super.runParameterizedQueryWithValuesArrayContents(
      queryText,
      values
    );
  }

  /**
   * update letter contents by letter id and recipient id
   * not needed under current requirements
   */
  // async updateLetterContentsByRecipientIdAndLetterId(letterContents: string, letterId: string, letterRecipient: string): Promise<boolean> {
  //   const queryText = this.updateLetterContentsByRecipientIdAndLetterIdQuery;
  //   const values = [letterContents, letterId, letterRecipient];
  //   return super.runParameterizedQueryWithValuesArrayUpdate(queryText, values);
  // }

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
      " as W on S.letter_recipient = W.public_address where S.letter_recipient = $1 order by S.sent_at DESC;",
  };

  // private selectAllLetterHistoryByLetterIdQuery = {
  //   text:
  //     "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at, S.letter_recipient, W.name as letter_recipient_name, S.sent_at from " +
  //     letterTableName +
  //     " as L inner join " +
  //     sentLetterTableName +
  //     " as S on L.letter_id = S.letter_id join " +
  //     userTableName +
  //     " as U on L.letter_requestor = U.public_address join " +
  //     userTableName +
  //     " as V on L.letter_writer = V.public_address join " +
  //     userTableName +
  //     " as W on S.letter_recipient = W.public_address where L.letter_id = $1;",
  // };

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
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is not NULL order by S.sent_at DESC;",
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
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL order by S.letter_recipient ASC;",
  };

  private selectAllUnsentRecipientsByLetterIdQuery = {
    text:
      "select distinct W.public_address, W.name from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL order by W.public_address ASC;",
  };

  private selectAllUnsentRecipientKeyByLetterIdQuery = {
    text:
      "select distinct W.public_address, W.name, W.public_key from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL order by W.public_address ASC;",
  };

  private countSentRecipientsByLetterIdQuery = {
    text:
      "select * from " +
      sentLetterTableName +
      " where letter_id = $1 and sent_at is not NULL;",
  };

  private countUnsentRecipientsByLetterIdQuery = {
    text:
      "select * from " +
      sentLetterTableName +
      " where letter_id = $1 and sent_at is NULL;",
  };

  private deletePreviousRecipientsByLetterIdQuery = {
    text:
      "delete from " +
      sentLetterTableName +
      " where letter_id = $1 and sent_at is NULL;",
  };

  private selectAllLetterHistoryByLetterIdAndRecipientIdQuery = {
    text:
      "select * from " +
      sentLetterTableName +
      " where letter_id = $1 and letter_recipient = $2 and sent_at is not NULL;",
  };

  private insertRecipientByLetterIdQuery = {
    text:
      "insert into " +
      sentLetterTableName +
      "(letter_recipient, letter_id, sent_at) values($1, $2, NULL);",
  };

  private selectLetterContentsByLetterIdAndRecipientIdQuery = {
    text:
      "select distinct letter_contents from " +
      letterTableName +
      " as L join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id where L.letter_id = $1 and S.letter_recipient = $2;",
  };

  // private updateLetterContentsByRecipientIdAndLetterIdQuery = {
  //   text:
  //     "update " +
  //     letterTableName +
  //     " as L set L.contents = $1 from " +
  //     sentLetterTableName +
  //     " as S where L.letter_id = S.letter_id and L.letter_id = $2 and S.letter_recipient = $3;",
  // };

  protected dbRowToDbModel(dbRow: any): LetterHistory {
    return LetterHistory.dbRowToDbModel(dbRow);
  }
}
