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

  async createUser(address: string, name: string): Promise<UserAuth> | null {
    let nonce = uuid();
    const values = [address, name, nonce];
    let users: UserAuth[] = await super.runParameterizedQueryWithValuesArray(
      this.createUserQuery,
      values
    );
    if (users === []) {
      return null;
    }
    return users[0];
  }

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
      "insert into users values ($1, $2, current_timestamp, $3) returning *;",
  };

  private getUserAuthQuery = {
    text:
      "select public_address, name, nonce from " +
      userTableName +
      " where public_address = $1",
  };
}
