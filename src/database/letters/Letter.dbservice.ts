import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { Client } from "pg";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";

export class LetterDbService extends DatabaseService<Letter> {

    constructor() {
        super();
    }

    async selectAllLettersByRecipientId(id: string): Promise<Letter[]> {
        const dbModels: Letter[] = [];
        this.client = new Client(this.clientCredentials);
        this.client.connect();
        const values = [id];
        try {
            const res = await this.client.query(this.selectAllLettersByRecipientIdQuery, values);
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
            this.client.end().then(() => console.log("client has disconnected"));
        }
    }

    private selectAllLettersByRecipientIdQuery = {
        text: 'select * from ' + letterTableName + ' natural join ' + sentLetterTableName + ' where sent_letters.user_id = $1;'
    }


    protected dbRowToDbModel(dbRow: any): Letter {
        return Letter.dbRowToDbModel(dbRow);
    }

}