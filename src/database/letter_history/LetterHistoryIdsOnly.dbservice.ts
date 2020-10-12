import { DatabaseService } from "../dbservice";
import { Client } from "pg";
import { UserRole } from "../../modules/UserRole";
import { User } from "../users/User.dbmodel";
import { LetterHistoryIdsOnly } from "./LetterHistoryIdsOnly.model";
import { LetterHistory } from "./LetterHistory.model";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterHistoryIdsOnlyDbService extends DatabaseService<LetterHistoryIdsOnly> {

    constructor() {
        super();
    }

    /**
     * @param letterId letter_id to get letter history for (ids only)
     */
    async selectAllLetterHistoryIdsOnlyByLetterId(letterId: string): Promise<LetterHistoryIdsOnly[]> {
        const queryText = this.selectAllLetterHistoryIdsOnlyByLetterIdQuery;
        const values = [letterId];
        return super.runParameterizedQueryWithValuesArray(queryText, values);
    }

    // async selectAllLettersByAddressAndRole(address: string, userRole: UserRole): Promise<Letter[]> {
    //     const queryText = this.getQueryTextByUserRole(userRole);
    //     const values = [address];
    //     return super.runParameterizedQueryWithValuesArray(queryText, values);
    // }

    // private getQueryTextByUserRole(userRole: UserRole): any {
    //     if (userRole.valueOf() === UserRole.Recipient.valueOf()) {
    //         return this.selectAllLettersByRecipientIdQuery;
    //     }
    //     else if (userRole.valueOf() === UserRole.Requestor.valueOf()) {
    //         return this.selectAllLettersByRequestorIdQuery;
    //     }
    //     else if (userRole.valueOf() === UserRole.Writer.valueOf()) {
    //         return this.selectAllLettersByWriterIdQuery;
    //     }
    // }

    private selectAllLetterHistoryIdsOnlyByLetterIdQuery = {
        text: "select L.letter_id, letter_writer, letter_requestor, requested_at, uploaded_at, letter_recipient, sent_at from " + letterTableName + " as L inner join " + sentLetterTableName + " as S on L.letter_id = S.letter_id where L.letter_id = $1;"
    }


    protected dbRowToDbModel(dbRow: any): LetterHistoryIdsOnly {
        return LetterHistoryIdsOnly.dbRowToDbModel(dbRow);
    }

}