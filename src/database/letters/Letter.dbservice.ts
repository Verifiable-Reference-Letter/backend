import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { Client } from "pg";
import { UserRole } from "../../modules/UserRole";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterDbService extends DatabaseService<Letter> {

    constructor() {
        super();
    }

    async selectAllLettersByAddressAndRole(publicAddress: string, userRole: UserRole): Promise<Letter[]> {
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
        text: "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " + letterTableName + " as L inner join " + sentLetterTableName + " as S on L.letter_id = S.letter_id join " + userTableName + " as U on L.letter_requestor = U.public_address join " + userTableName + " as V on L.letter_writer = V.public_address where letter_requestor = $1;"
    }

    private selectAllLettersByWriterIdQuery = {
        text: "select L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " + letterTableName + " as L inner join " + sentLetterTableName + " as S on L.letter_id = S.letter_id join " + userTableName + " as U on L.letter_requestor = U.public_address join " + userTableName + " as V on L.letter_writer = V.public_address where letter_writer = $1;"

    }

    protected dbRowToDbModel(dbRow: any): Letter {
        return Letter.dbRowToDbModel(dbRow);
    }

}