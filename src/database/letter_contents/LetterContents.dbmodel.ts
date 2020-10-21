export class LetterContents {
  letterContent: string | null;

  constructor(letterContent: Buffer) {
    if (letterContent !== null) {
      this.letterContent = letterContent.toString('utf8');
    } else {
      this.letterContent = null;
    }
  }

  get content(): string {
    return this.letterContent;
  }

  static dbRowToDbModel(dbRow: any) {
    // console.log("dbRowLength", dbRow.letter_contents.toString('utf8').length);
    const newDbModel = new LetterContents(dbRow.letter_contents);
    return newDbModel;
  }
}
