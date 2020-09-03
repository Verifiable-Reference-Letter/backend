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
            text: 'SELECT * from ' + userTableName + ' WHERE public_address = $1'
        }
    }

    protected dbRowToDbModel(dbRow: any): User {
        return User.dbRowToDbModel(dbRow);
    }

    async createUser(address: string, name: string): Promise<User> {
        const values = [address, name];
        let users: User[] = await super.runParameterizedQueryWithValuesArray(this.createUserQuery, values);
        return users[0];
    }

    private createUserQuery = {
        text: 'insert into users values ($1, $2, current_timestamp, 0) returning *;'
    }

}