import { DatabaseService } from "../dbservice";
import { LetterRecipientContents } from "./LetterRecipientContents.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterRecipientContentsDbService extends DatabaseService<
  LetterRecipientContents
> {
  constructor() {
    super();
  }

  /**
   * retrieval of the letter contents (encrypted with recipient's)
   * select the letter contents by letter id and recipient's public address
   * @param letterId
   * @param letterWriter
   */
  async selectLetterContentsByLetterIdAndRecipientId(
    letterId: string,
    letterRecipient: string
  ): Promise<LetterRecipientContents[]> {
    const queryText = this.selectLetterContentsByLetterIdAndRecipientIdQuery;
    const values = [letterId, letterRecipient];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * update the letter contents as a buffer from utf8
   * previously null if first upload
   * @param letterContents in utf8
   * @param currentDate
   * @param letterId
   * @param letterRecipient
   */
  async updateLetterContentsByLetterIdAndRecipientId(
    letterContents: string,
    letterHash: string,
    letterSignature: string,
    currentDate: string,
    letterId: string,
    letterRecipient: string
  ): Promise<boolean> {
    console.log(letterContents.length);
    const letterContentObj: Buffer = Buffer.from(letterContents, "utf8");
    const queryText = this.updateLetterContentsByLetterIdAndRecipientIdQuery;
    const values = [
      letterContentObj,
      letterHash,
      letterSignature,
      currentDate.substring(0, 24),
      letterId,
      letterRecipient,
    ];
    return super.runParameterizedQueryWithValuesArrayUpdate(queryText, values);
  }

  private selectLetterContentsByLetterIdAndRecipientIdQuery = {
    text:
      "select letter_contents, letter_hash, letter_signature from " +
      sentLetterTableName +
      " where letter_id = $1 and letter_recipient = $2",
  };

  private updateLetterContentsByLetterIdAndRecipientIdQuery = {
    text:
      "update " +
      sentLetterTableName +
      " set letter_contents = $1, letter_hash = $2, letter_signature = $3, sent_at = $4 where letter_id = $5 and letter_recipient = $6;",
  };

  protected dbRowToDbModel(dbRow: any): LetterRecipientContents {
    return LetterRecipientContents.dbRowToDbModel(dbRow);
  }
}
