export class LetterRecipientContents {
  letterContents: string | null;
  // letterHash: string | null;
  letterSignature: string | null;

  constructor(
    letterContents: Buffer | null,
    // letterHash: string | null,
    letterSignature: string | null,
  ) {
    if (letterContents !== null) {
      this.letterContents = letterContents.toString("utf8");
    } else {
      this.letterContents = null;
    }
    // this.letterHash = letterHash;
    this.letterSignature = letterSignature;
  }

  get contents(): string | null {
    return this.letterContents;
  }

  // get hash(): string | null {
  //   return this.letterHash;
  // }

  get sig(): string | null {
    return this.letterSignature;
  }

  static dbRowToDbModel(dbRow: any) {
    // console.log("dbRowLength", dbRow.letter_contents.toString('utf8').length);
    const newDbModel = new LetterRecipientContents(dbRow.letter_contents, dbRow.letter_signature);
    return newDbModel;
  }
}
