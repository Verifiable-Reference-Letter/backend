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
   * Get a UserEmail object tying a user and an email together
   * @param address 
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

  async updateEmailVerificationStatus(address: string): Promise<boolean> | null {
    const values = [true, address];
    return super.runParameterizedQueryWithValuesArrayUpdate(this.updateEmailVerificationStatusQuery, values);
  }

  private updateEmailVerificationStatusQuery = {
    text: "update " + userTableName + " set is_email_verified = $1 where public_address = $2"
  };

}
