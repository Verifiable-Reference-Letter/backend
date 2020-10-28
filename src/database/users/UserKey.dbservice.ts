import { DatabaseService } from "../dbservice";
import { UserKey } from "./UserKey.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class UserKeyDbService extends DatabaseService<UserKey> {
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
   * select userkey by public address
   * @param publicAddress
   */
  async selectUserKey(publicAddress: string): Promise<UserKey> | null {
    const values = [publicAddress];
    let users: UserKey[] = await super.runParameterizedQueryWithValuesArray(
      this.selectUserKeyQuery,
      values
    );
    if (users === undefined) {
      return null;
    }
    return users[0];
  }

  /**
   * update public key of user
   * TODO: need to make sure user is created in the databse with public key
   * @param publicAddress of user to update
   * @param publicKey of user
   */
  async updateUserKey(
    publicAddress: string,
    publicKey: string
  ): Promise<boolean> {
    const queryText = this.updateUserKeyQuery;
    const values = [publicKey, publicAddress];
    return await super.runParameterizedQueryWithValuesArrayUpdate(
      queryText,
      values
    );
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
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  private selectUserKeyQuery = {
    text:
      "select public_address, name, public_key from " +
      userTableName +
      " where public_address = $1",
  };

  private updateUserKeyQuery = {
    text:
      "update " +
      userTableName +
      " set public_key = $1 where public_address = $2;",
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

  protected dbRowToDbModel(dbRow: any): UserKey {
    return UserKey.dbRowToDbModel(dbRow);
  }
}
