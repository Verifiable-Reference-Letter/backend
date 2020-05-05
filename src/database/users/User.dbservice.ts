import { DatabaseService } from "../dbservice";
import { User } from "./User.dbmodel";

const userTableName: string = "users";

export class UsersDbService extends DatabaseService<User> {

    constructor() {
        super();
        this.initializePreparedQueries();
    }

    private initializePreparedQueries(): void {
        this.selectAllQuery = {
            text: "SELECT * from " + userTableName
        }
        this.selectOneRowByIdQuery = {
            text: 'SELECT * from ' + userTableName + ' WHERE user_id = $1'
        }
    }

    protected dbRowToDbModel(dbRow: any): User {
        return User.dbRowToDbModel(dbRow);
    }

}