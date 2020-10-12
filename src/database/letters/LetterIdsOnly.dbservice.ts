import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { LetterIdsOnly } from "./LetterIdsOnly.dbmodel";
import { Client } from "pg";
import { UserRole } from "../../modules/UserRole";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterIdsOnlyDbService extends DatabaseService<LetterIdsOnly> {

    constructor() {
        super();
    }

    async selectAllLettersByAddressAndRole(publicAddress: string, userRole: UserRole): Promise<LetterIdsOnly[]> {
        const queryText = this.getQueryTextByUserRole(userRole);
        const values = [publicAddress];
        return super.runParameterizedQueryWithValuesArray(queryText, values);
    }

    private getQueryTextByUserRole(userRole: UserRole): any {
        if (userRole.valueOf() === UserRole.Requestor.valueOf()) {
            return this.selectAllLettersByRequestorIdQuery;
        }
        else if (userRole.valueOf() === UserRole.Writer.valueOf()) {
            return this.selectAllLettersByWriterIdQuery;
        }
    }

    private selectAllLettersByRequestorIdQuery = {
        text: 'select letter_id, letter_requestor, letter_writer, requested_at, uploaded_at from ' + letterTableName + ' where letter_requestor = $1;'
    }

    private selectAllLettersByWriterIdQuery = {
        text: 'select letter_id, letter_requestor, letter_writer, requested_at, uploaded_at from ' + letterTableName + ' where letter_writer = $1;'
    }

    protected dbRowToDbModel(dbRow: any): LetterIdsOnly {
        return LetterIdsOnly.dbRowToDbModel(dbRow);
    }

}