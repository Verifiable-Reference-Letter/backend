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

    /**
     * retrieve an user by public address
     * @param publicAddress 
     */
    async selectUserByPublicAddress(publicAddress: string): Promise<User[]> {
        const queryText = this.selectUserByPublicAddressQuery;
        const values = [publicAddress];
        return super.runParameterizedQueryWithValuesArray(queryText, values); 
    }

    /**
     * retrieve all users
     */
    async selectAllUsers(): Promise<User[]> {
        const queryText = this.selectAllUsersQuery;
        const values: string[] = [];
        return super.runParameterizedQueryWithValuesArray(queryText, values); 
    }

    /**
     * retrieve all users but exclude self
     * i.e cannot request letter to self
     * @param publicAddress 
     */
    async selectAllUsersExceptSelf(publicAddress: string): Promise<User[]> {
        const queryText = this.selectAllUsersExceptSelfQuery;
        const values: string[] = [publicAddress];
        return super.runParameterizedQueryWithValuesArray(queryText, values); 
    }

    private selectUserByPublicAddressQuery = {
        text: 'SELECT public_address, name from ' + userTableName + ' WHERE public_address = $1'
    }

    private selectAllUsersQuery = {
        text: 'SELECT public_address, name from ' + userTableName
    }

    private selectAllUsersExceptSelfQuery = {
        text: 'SELECT public_address, name from ' + userTableName + ' WHERE public_address != $1'
    }

    protected dbRowToDbModel(dbRow: any): User {
        return User.dbRowToDbModel(dbRow);
    }
}