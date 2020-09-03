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
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE public_address = $1'
        }
    }

    async selectAllSentLettersByRecipientAddress(id: string): Promise<SentLetter[]> {
        const values = [id];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByRecipientQuery, values);
    }

    async selectAllSentLettersByLetterId(id: string): Promise<SentLetter[]> {
        const values = [id];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByLetterIdQuery, values);
    }

    private selectAllSentLettersByLetterIdQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE letter_id = $1'
    }

    protected dbRowToDbModel(dbRow: any): SentLetter {
        return SentLetter.dbRowToDbModel(dbRow);
    }

    private selectAllSentLettersByRecipientQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE public_address = $1'
    }

}