import { v4 as uuid } from 'uuid';
import { DatabaseService } from "../dbservice";
import { User } from "./User.dbmodel";

const userTableName: string = "users";

export class UserDbService extends DatabaseService<User> {

    constructor() {
        super();
        this.initializePreparedQueries();
    }

    private initializePreparedQueries(): void {
        this.selectAllQuery = {
            text: "SELECT * from " + userTableName
        }
        this.selectOneRowByIdQuery = {
            text: 'SELECT * from ' + userTableName + ' WHERE public_address = $1'
        }
    }

    protected dbRowToDbModel(dbRow: any): User {
        return User.dbRowToDbModel(dbRow);
    }
}