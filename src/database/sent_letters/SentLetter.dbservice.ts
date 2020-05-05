import { DatabaseService } from "../dbservice";
import { SentLetter } from "./SentLetter.dbmodel";
import { Client } from "pg";


const sentLetterTableName = "sent_letters";

export class SentLetterDbService extends DatabaseService<SentLetter> {

    constructor() {
        super();
        this.initializePreparedQueries();
    }

    private initializePreparedQueries(): void {
        this.selectAllQuery = {
            text: "SELECT * from " + sentLetterTableName
        }
        this.selectOneRowByIdQuery = {
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE user_id = $1'
        }
    }

    async selectAllSentLettersByRecipientId(id: string): Promise<SentLetter[]> {
        const dbModels: SentLetter[] = [];
        this.client = new Client(this.clientCredentials);
        this.client.connect();
        const values = [id];
        try {
            const res = await this.client.query(this.selectAllSentLettersByRecipientQuery, values);
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

    protected dbRowToDbModel(dbRow: any): SentLetter {
        return SentLetter.dbRowToDbModel(dbRow);
    }

    private selectAllSentLettersByRecipientQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE user_id = $1'
    }

}