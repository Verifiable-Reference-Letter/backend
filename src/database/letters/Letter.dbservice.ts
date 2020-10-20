import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { Client } from "pg";
import { UserRole } from "../users/UserRole";

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

    async insertLetterByAddressAndLetterDetails(letterId: string, letterRequestor: string, letterWriter: string, currentDate: string): Promise<boolean> {
        const queryText = this.insertLetterByAddressAndLetterDetailsQuery;
        console.log(currentDate);
        console.log(currentDate.substring(0, 24));
        const values = [letterId, letterRequestor, letterWriter, currentDate.substring(0, 24), null];
        return super.runParameterizedQueryWithValuesArrayInsert(queryText, values);
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
        text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " + letterTableName + " as L inner join " + userTableName + " as U on L.letter_requestor = U.public_address join " + userTableName + " as V on L.letter_writer = V.public_address where letter_requestor = $1;"
    }

    private selectAllLettersByWriterIdQuery = {
        text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " + letterTableName + " as L inner join " + userTableName + " as U on L.letter_requestor = U.public_address join " + userTableName + " as V on L.letter_writer = V.public_address where letter_writer = $1;"

    }

    private insertLetterByAddressAndLetterDetailsQuery = {
        text: "insert into " + letterTableName + "(letter_id, letter_requestor, letter_writer, requested_at, uploaded_at) values($1, $2, $3, $4, $5)"
    }

    protected dbRowToDbModel(dbRow: any): Letter {
        return Letter.dbRowToDbModel(dbRow);
    }

}