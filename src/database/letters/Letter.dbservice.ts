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

    async selectAllLettersByUserIdAndRole(id: string, userRole: UserRole): Promise<Letter[]> {
        const dbModels: Letter[] = [];
        const client = new Client(this.clientCredentials);
        client.connect();
        const queryText = this.getQueryTextByUserRole(userRole);
        const values = [id];
        try {
            const res = await client.query(queryText, values);
            let jsonRow;
                for (const row of res.rows) {
                    jsonRow = JSON.stringify(row);
                    console.log(jsonRow);
                    dbModels.push(this.dbRowToDbModel(row));
                }
                dbModels.filter((value: any) => Object.keys(value).length !== 0);
                dbModels.map((value, index) => {
                console.log("Db Model " + index + ": ");
                console.dir(value);
                });
            return dbModels;
        } catch (err) {
            console.log(err.stack);
        } finally {
            client.end().then(() => console.log("client has disconnected"));
        }
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
        text: 'select * from ' + letterTableName + ' natural left join ' + sentLetterTableName + ' where user_id = $1;'
    }

    private selectAllLettersByRequestorIdQuery = {
        text: 'select * from ' + letterTableName + ' natural left join ' + sentLetterTableName + ' where letter_requestor = $1;'
    }

    private selectAllLettersByWriterIdQuery = {
        text: 'select * from ' + letterTableName + ' natural left join ' + sentLetterTableName + ' where letter_writer_id = $1;'
    }

    protected dbRowToDbModel(dbRow: any): Letter {
        return Letter.dbRowToDbModel(dbRow);
    }

}