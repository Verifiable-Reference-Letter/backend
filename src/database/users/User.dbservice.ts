import { DatabaseService } from "../dbservice";
import { User } from "./User.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class UserDbService extends DatabaseService<User> {
  constructor() {
    super();
    this.initializePreparedQueries();
  }

  private initializePreparedQueries(): void {
    this.selectAllQuery = {
      text: "SELECT * from " + userTableName,
    };
    this.selectOneRowByIdQuery = {
      text: "SELECT * from " + userTableName + " WHERE public_address = $1",
    };
  }

  /**
   * retrieve an user by public address
   * @param publicAddress
   */
  async selectUserByPublicAddress(publicAddress: string): Promise<User[]> {
    const queryText = this.selectUserByPublicAddressQuery;
    const values = [publicAddress];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * retrieve all users
   */
  async selectAllUsers(): Promise<User[]> {
    const queryText = this.selectAllUsersQuery;
    const values: string[] = [];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * retrieve all users but exclude self
   * i.e cannot request letter to self
   * @param publicAddress
   */
  async selectAllUsersExceptSelf(publicAddress: string): Promise<User[]> {
    const queryText = this.selectAllUsersExceptSelfQuery;
    const values: string[] = [publicAddress];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * retrieve all requestors who have sent a letter to the recipient
   * @param publicAddress of recipient
   */
  async selectAllLetterRequestorByLetterRecipient(
    publicAddress: string
  ): Promise<User[]> {
    const queryText = this.selectAllLetterRequestorByLetterRecipientQuery;
    const values = [publicAddress];
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
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * sent recipients
   * retrieval of all unsent letter recipients (Users) rather than full letter history
   * for a given letter id (for either requestor or writer)
   * @param letterId
   */
  async selectAllSentRecipientsByLetterId(letterId: string): Promise<User[]> {
    const queryText = this.selectAllSentRecipientsByLetterIdQuery;
    const values = [letterId];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  private selectUserByPublicAddressQuery = {
    text:
      "SELECT public_address, name from " +
      userTableName +
      " WHERE public_address = $1",
  };

  private selectAllUsersQuery = {
    text:
      "SELECT public_address, name from " +
      userTableName +
      " order by name ASC",
  };

  private selectAllUsersExceptSelfQuery = {
    text:
      "SELECT public_address, name from " +
      userTableName +
      " WHERE public_address != $1 order by name ASC",
  };

  private selectAllLetterRequestorByLetterRecipientQuery = {
    text:
      "select distinct on (letter_requestor) letter_requestor as public_address, letter_requestor_name as name from (select distinct L.letter_requestor, U.name as letter_requestor_name, S.sent_at from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where S.letter_recipient = $1 order by S.sent_at DESC ) subquery;",
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

  private selectAllSentRecipientsByLetterIdQuery = {
    text:
      "select distinct W.public_address, W.name from " +
      letterTableName +
      " as L inner join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id join " +
      userTableName +
      " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is not NULL order by W.public_address ASC;",
  };

  protected dbRowToDbModel(dbRow: any): User {
    return User.dbRowToDbModel(dbRow);
  }
}
