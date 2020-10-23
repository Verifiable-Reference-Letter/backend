import { DatabaseService } from "../dbservice";
import { Letter } from "./Letter.dbmodel";
import { LetterContents } from "../letter_contents/LetterContents.dbmodel";
import { UserRole } from "../users/UserRole";

const letterTableName = "letters";
const userTableName = "users";

export class LetterDbService extends DatabaseService<Letter> {
  constructor() {
    super();
  }

  /**
   * select all letters for either requestor or writer by public address
   * @param publicAddress 
   * @param userRole 
   */
  async selectAllLettersByAddressAndRole(
    publicAddress: string,
    userRole: UserRole
  ): Promise<Letter[]> {
    const queryText = this.getQueryTextByUserRole(userRole);
    const values = [publicAddress];
    return super.runParameterizedQueryWithValuesArray(queryText, values);
  }

  /**
   * select a letter by address, letter id, and user role
   * @param publicAddress
   * @param letterId 
   * @param userRole 
   */
  async selectLetterByAddressAndLetterId(
    publicAddress: string,
    letterId: string,
    userRole: UserRole
  ): Promise<Letter[]> {
    if (userRole === UserRole.Requestor) {
      const queryText = this.selectLetterByLetterIdAndRequestorIdQuery;
      const values = [publicAddress, letterId];
      return super.runParameterizedQueryWithValuesArray(queryText, values);
    } else if (userRole == UserRole.Writer) {
      const queryText = this.selectLetterByLetterIdAndWriterIdQuery;
      const values = [publicAddress, letterId];
      return super.runParameterizedQueryWithValuesArray(queryText, values);
    }
  }

  /**
   * creation of new letter
   * insert a letter based on letter details
   * @param letterId 
   * @param letterRequestor 
   * @param letterWriter writer's public address
   * @param currentDate 
   */
  async insertLetterByAddressAndLetterDetails(
    letterId: string,
    letterRequestor: string,
    letterWriter: string,
    currentDate: string
  ): Promise<boolean> {
    const queryText = this.insertLetterByAddressAndLetterDetailsQuery;
    const values = [
      letterId,
      letterRequestor,
      letterWriter,
      currentDate.substring(0, 24),
      null,
    ];
    return super.runParameterizedQueryWithValuesArrayInsert(queryText, values);
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
    return super.runParameterizedQueryWithValuesArrayContents(
      queryText,
      values
    );
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
    const letterContentObj: Buffer = Buffer.from(letterContents, 'utf8');
    const queryText = this.updateLetterContentsByLetterIdAndWriterIdQuery;
    const values = [letterContentObj, currentDate.substring(0, 24),letterId, letterWriter];
    return super.runParameterizedQueryWithValuesArrayUpdate(queryText, values);
  }

  /**
   * helper for the select all letter method
   * determine query based off user role
   * @param userRole requestor or writer
   */
  private getQueryTextByUserRole(userRole: UserRole): any {
    if (userRole.valueOf() === UserRole.Requestor.valueOf()) {
      return this.selectAllLettersByRequestorIdQuery;
    } else if (userRole.valueOf() === UserRole.Writer.valueOf()) {
      return this.selectAllLettersByWriterIdQuery;
    }
  }

  private selectAllLettersByRequestorIdQuery = {
    text:
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
      letterTableName +
      " as L inner join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address where letter_requestor = $1;",
  };

  private selectAllLettersByWriterIdQuery = {
    text:
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
      letterTableName +
      " as L inner join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address where letter_writer = $1;",
  };

  private selectLetterByLetterIdAndRequestorIdQuery = {
    text:
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
      letterTableName +
      " as L inner join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address where letter_id = $1 and letter_requestor = $2;",
  };

  private selectLetterByLetterIdAndWriterIdQuery = {
    text:
      "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
      letterTableName +
      " as L inner join " +
      userTableName +
      " as U on L.letter_requestor = U.public_address join " +
      userTableName +
      " as V on L.letter_writer = V.public_address where letter_id = $1 and letter_writer = $2;",
  };

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

  private insertLetterByAddressAndLetterDetailsQuery = {
    text:
      "insert into " +
      letterTableName +
      "(letter_id, letter_requestor, letter_writer, requested_at, uploaded_at) values($1, $2, $3, $4, $5);",
  };

  protected dbRowToDbModel(dbRow: any): Letter {
    return Letter.dbRowToDbModel(dbRow);
  }
}
