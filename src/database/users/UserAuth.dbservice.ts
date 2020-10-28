import { v4 as uuid } from "uuid";
import { DatabaseService } from "../dbservice";
import { UserAuth } from "./UserAuth.dbmodel";

const userTableName: string = "users";

export class UserAuthDbService extends DatabaseService<UserAuth> {
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

  protected dbRowToDbModel(dbRow: any): UserAuth {
    return UserAuth.dbRowToDbModel(dbRow);
  }

  /**
   * sign up to create new users
   * set random nonce
   * TODO: user should be created in the db with the public key also
   * @param publicAddress 
   * @param name 
   */
  async createUser(publicAddress: string, name: string, email: string, publicKey: string): Promise<UserAuth> | null {
    let nonce = uuid();
    const currentDate = Date();
    const values = [publicAddress, name, currentDate, nonce, email, publicKey];
    let users: UserAuth[] = await super.runParameterizedQueryWithValuesArray(
      this.createUserQuery,
      values
    );
    if (users === []) {
      return null;
    }
    return users[0];
  }

  /**
   * retrieve a user with nonce by public address
   * @param publicAddress 
   */
  async getUserAuth(publicAddress: string): Promise<UserAuth> | null {
    const values = [publicAddress];
    let users: UserAuth[] = await super.runParameterizedQueryWithValuesArray(
      this.getUserAuthQuery,
      values
    );
    if (users === undefined) {
      return null;
    }
    return users[0];
  }

  private createUserQuery = {
    text:
      "insert into users(public_address, name, created_at, nonce, email, profile_image, public_key) values ($1, $2, $3, $4, $5, null, $6) returning *;",
  };

  private getUserAuthQuery = {
    text:
      "select public_address, name, nonce from " +
      userTableName +
      " where public_address = $1;",
  };
}
