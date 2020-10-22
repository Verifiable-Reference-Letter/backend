import { v4 as uuid } from "uuid";
import { DatabaseService } from "../dbservice";
import { UserKey } from "./UserKey.dbmodel";

const userTableName: string = "users";

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

  protected dbRowToDbModel(dbRow: any): UserKey {
    return UserKey.dbRowToDbModel(dbRow);
  }

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
   * update publicKey field of user
   * TODO: make this at signup rather than at first login
   * @param publicAddress of user to update
   * @param publicKey of user
   */
  async updateUserKey(publicAddress: string, publicKey: string): Promise<boolean> {
    const queryText = this.updateUserKeyQuery;
    const values = [publicAddress, publicKey];
    return await super.runParameterizedQueryWithValuesArrayUpdate(
      queryText,
      values
    );
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
}
