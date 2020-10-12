export class LetterIdsOnly {

  letterId: string;
  letterWriterId: string;
  letterRequestorId: string;
  requestedAt: Date | null;
  uploadedAt: Date | null;

  constructor(
      letterId: string,
      letterWriterId: string,
      letterRequestorId: string,
      requestedAt: Date | null,
      uploadedAt: Date | null,
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