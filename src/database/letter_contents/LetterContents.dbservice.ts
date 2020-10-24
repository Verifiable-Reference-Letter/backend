import { DatabaseService } from "../dbservice";
import { LetterContents } from "./LetterContents.dbmodel";
import { User } from "../users/User.dbmodel";
import { UserKey } from "../users/UserKey.dbmodel";

const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";

export class LetterContentsDbService extends DatabaseService<LetterContents> {
  constructor() {
    super();
  }

  /**
   * retrieval of the letter contents
   * select the letter contents by letter id and writer's public address
   * @param letterId
   * @param letterWriter
   */
  async selectLetterContentsByLetterIdAndWriterId(
    letterId: string,
    letterWriter: string
  ): Promise<LetterContents[]> {
    const queryText = this.selectLetterContentsByLetterIdAndWriterIdQuery;
    const values = [letterId, letterWriter];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * update the letter contents as a buffer from utf8
   * previously null if first upload
   * @param letterContents in utf8
   * @param currentDate
   * @param letterId
   * @param letterWriter
   */
  async updateLetterContentsByLetterIdAndWriterId(
    letterContents: string,
    currentDate: string,
    letterId: string,
    letterWriter: string
  ): Promise<boolean> {
    console.log(letterContents.length);
    const letterContentObj: Buffer = Buffer.from(letterContents, "utf8");
    const queryText = this.updateLetterContentsByLetterIdAndWriterIdQuery;
    const values = [
      letterContentObj,
      currentDate.substring(0, 24),
      letterId,
      letterWriter,
    ];
    return super.runParameterizedQueryWithValuesArrayUpdate(queryText, values);
  }

  /**
   * retrieve letter contents by letter id and recipient id
   * @param letterId
   * @param letterRecipient
   */
  async selectLetterContentsByLetterIdAndRecipientId(
    letterId: string,
    letterRecipient: string
  ): Promise<LetterContents[]> {
    const queryText = this.selectLetterContentsByLetterIdAndRecipientIdQuery;
    const values = [letterId, letterRecipient];
    return super.runParameterizedQueryWithValuesArray(
      queryText,
      values
    );
  }

  private selectLetterContentsByLetterIdAndWriterIdQuery = {
    text:
      "select letter_contents from " +
      letterTableName +
      " where letter_id = $1 and letter_writer = $2",
  };

  private updateLetterContentsByLetterIdAndWriterIdQuery = {
    text:
      "update " +
      letterTableName +
      " set letter_contents = $1, uploaded_at = $2 where letter_id = $3 and letter_writer = $4;",
  };

  private selectLetterContentsByLetterIdAndRecipientIdQuery = {
    text:
      "select distinct letter_contents from " +
      letterTableName +
      " as L join " +
      sentLetterTableName +
      " as S on L.letter_id = S.letter_id where L.letter_id = $1 and S.letter_recipient = $2;",
  };

  protected dbRowToDbModel(dbRow: any): LetterContents {
    return LetterContents.dbRowToDbModel(dbRow);
  }
}
