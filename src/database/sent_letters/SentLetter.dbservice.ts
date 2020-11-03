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
    async selectAllSentLettersByRecipientAddress(publicAddress: string): Promise<SentLetter[]> {
        const values = [publicAddress];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByRecipientQuery, values);
    }

    /**
     * select all sent letter rows by letter id
     * @param id 
     */
    async selectAllSentLettersByLetterId(letterId: string): Promise<SentLetter[]> {
        const values = [letterId];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByLetterIdQuery, values);
    }

    
    /**
     * select all sent letter rows by letter id
     * @param id 
     */
    async selectAllSentLettersByLetterIdAndRecipient(letterId: string, publicAddress: string): Promise<SentLetter[]> {
        const values = [letterId, publicAddress];
        return super.runParameterizedQueryWithValuesArray(this.selectAllSentLettersByLetterIdAndRecipientQuery, values);
    }

    private selectAllSentLettersByRecipientQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE letter_recipient = $1;'
    }

    private selectAllSentLettersByLetterIdQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE letter_id = $1;'
    }

    private selectAllSentLettersByLetterIdAndRecipientQuery = {
        text: 'SELECT * from ' + sentLetterTableName + ' WHERE letter_id = $1 and letter_recipient = $2;'
    }

    protected dbRowToDbModel(dbRow: any): SentLetter {
        return SentLetter.dbRowToDbModel(dbRow);
    }
}