import { v4 as uuid } from "uuid";
import { DatabaseService } from "../dbservice";
import { UserAuth } from "./UserAuth.dbmodel";
import { UserEmail } from "./UserEmail.dbmodel";

const userTableName: string = "users";

export class UserEmailDbService extends DatabaseService<UserEmail> {
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

  protected dbRowToDbModel(dbRow: any): UserEmail {
    return UserEmail.dbRowToDbModel(dbRow);
  }

  /**
   * sign up to create new users
   * set random nonce
   * TODO: user should be created in the db with the public key also
   * @param address 
   * @param name 
   */
  async getUserEmail(address: string): Promise<UserEmail> | null {
    const values = [address];
    let users: UserEmail[] = await super.runParameterizedQueryWithValuesArray(
      this.selectOneRowByIdQuery,
      values
    );
    if (users === []) {
      return null;
    }
    return users[0];
  }

}
