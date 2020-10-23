import { DatabaseService } from "../dbservice";
import { UserProfile } from "./UserProfile.dbmodel";

const userTableName: string = "users";

export class UserProfileDbService extends DatabaseService<UserProfile> {

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
     * retrieve userprofile by public address
     * @param publicAddress 
     */
    async selectUserProfileByPublicAddress(publicAddress: string): Promise<UserProfile[]> {
        const queryText = this.selectUserProfileByPublicAddressQuery;
        const values = [publicAddress];
        return super.runParameterizedQueryWithValuesArray(queryText, values); 
    }

    private selectUserProfileByPublicAddressQuery = {
        text: 'SELECT public_address, name, profile_image, created_at from ' + userTableName + ' WHERE public_address = $1'
    }

    protected dbRowToDbModel(dbRow: any): UserProfile {
        return UserProfile.dbRowToDbModel(dbRow);
    }
}