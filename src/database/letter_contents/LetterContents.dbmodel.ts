export class LetterContents {
  letterContents: string | null;

  constructor(letterContents: Buffer | null) {
    if (letterContents !== null) {
      this.letterContents = letterContents.toString('utf8');
    } else {
      this.letterContents = null;
    }
  }

  get contents(): string | null {
    return this.letterContents;
  }

  static dbRowToDbModel(dbRow: any) {
    // console.log("dbRowLength", dbRow.letter_contents.toString('utf8').length);
    const newDbModel = new LetterContents(dbRow.letter_contents);
    return newDbModel;
  }
}
