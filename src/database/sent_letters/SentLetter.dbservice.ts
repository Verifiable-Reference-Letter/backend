import { DatabaseService } from "../dbservice";
import { SentLetter } from "./SentLetter.dbmodel";

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

    /**
     * select all sent letter rows by recipient's address
     * @param id
     */
    async selectAllSentLettersByRecipientAddress(id: string): Promise<SentLetter[]> {
        const values = [id];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByRecipientQuery, values);
    }

    /**
     * select all sent letter rows by letter id
     * @param id 
     */
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