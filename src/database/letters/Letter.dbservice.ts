import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { Client } from "pg";
import { UserRole } from "../../modules/UserRole";
import { User } from "../users/User.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";

export class LetterDbService extends DatabaseService<Letter> {

    constructor() {
        super();
    }

    async selectAllLettersByAddressAndRole(address: string, userRole: UserRole): Promise<Letter[]> {
        const queryText = this.getQueryTextByUserRole(userRole);
        const values = [address];
        return super.runParameterizedQueryWithValuesArray(queryText, values);
    }

    private getQueryTextByUserRole(userRole: UserRole): any {
        if (userRole.valueOf() === UserRole.Recipient.valueOf()) {
            return this.selectAllLettersByRecipientIdQuery;
        }
        else if (userRole.valueOf() === UserRole.Requestor.valueOf()) {
            return this.selectAllLettersByRequestorIdQuery;
        }
        else if (userRole.valueOf() === UserRole.Writer.valueOf()) {
            return this.selectAllLettersByWriterIdQuery;
        }
    }

    private selectAllLettersByRecipientIdQuery = {
        text: 'select letter_id, letter_writer, letter_requestor from ' + letterTableName + ' natural left join ' + sentLetterTableName + ' where public_address = $1;'
    }

    private selectAllLettersByRequestorIdQuery = {
        text: 'select * from ' + letterTableName + ' where letter_requestor = $1;'
    }

    private selectAllLettersByWriterIdQuery = {
        text: 'select * from ' + letterTableName + ' where letter_writer = $1;'
    }

    protected dbRowToDbModel(dbRow: any): Letter {
        return Letter.dbRowToDbModel(dbRow);
    }

}