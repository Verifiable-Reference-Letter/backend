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
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE user_id = $1'
        }
    }

    protected dbRowToDbModel(dbRow: any): SentLetter {
        return SentLetter.dbRowToDbModel(dbRow);
    }

}