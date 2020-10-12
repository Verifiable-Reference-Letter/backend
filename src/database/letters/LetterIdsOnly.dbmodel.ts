export class LetterIdsOnly {

  letterId: string;
  letterWriterId: string;
  letterRequestorId: string;
  requestedAt: Date;
  uploadedAt: Date;

  constructor(
      letterId: string,
      letterWriterId: string,
      letterRequestorId: string,
      requestedAt: Date,
      uploadedAt: Date,
  ) {
      this.letterId = letterId;
      this.letterWriterId = letterWriterId;
      this.letterRequestorId = letterRequestorId;
      this.requestedAt = requestedAt;
      this.uploadedAt = uploadedAt;
  }

  static dbRowToDbModel(dbRow: any) {
      const newDbModel = new LetterIdsOnly(
          dbRow.letter_id,
          dbRow.letter_writer,
          dbRow.letter_requestor,
          dbRow.requestedAt,
          dbRow.uploadedAt,
      );
      return newDbModel;
  }
}