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

  async getUserAuth(publicAddress: string): Promise<UserAuth> | null {
    const values = [publicAddress];
    let users: UserAuth[] = await super.runParameterizedQueryWithValuesArray(
      this.getUserAuthQuery,
      values
    );
    if (users === []) {
      return null;
    }
    return users[0];
  }

  private getUserAuthQuery = {
    text: "select publicAddress, name, nonce from " + userTableName + "userTableName where publicAddress = $1",
  };
}
