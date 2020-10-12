export class LetterIdsOnly {

  letterId: string;
  letterRequestorId: string;
  letterWriterId: string;
  requestedAt: Date;
  uploadedAt: Date | null;

  constructor(
      letterId: string,
      letterRequestorId: string,
      letterWriterId: string,
      requestedAt: Date,
      uploadedAt: Date | null,
  ) {
      this.letterId = letterId;
      this.letterRequestorId = letterRequestorId;
      this.letterWriterId = letterWriterId;
      this.requestedAt = requestedAt;
      this.uploadedAt = uploadedAt;
  }

  static dbRowToDbModel(dbRow: any) {
      const newDbModel = new LetterIdsOnly(
          dbRow.letter_id,
          dbRow.letter_requestor,
          dbRow.letter_writer,
          new Date(dbRow.requested_at),
          dbRow.uploaded_at ? new Date(dbRow.uploaded_at) : dbRow.uploaded_at,
      );
      return newDbModel;
  }
}