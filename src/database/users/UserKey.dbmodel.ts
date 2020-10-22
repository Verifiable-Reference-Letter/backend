export class UserKey {

  publicAddress: string;
  name: string;
  publicKey: string;

  constructor(
      publicAddress: string,
      name: string,
      publicKey: string
  ) {
          this.publicAddress = publicAddress;
          this.name = name;
          this.publicKey = publicKey;
  }

  static dbRowToDbModel(dbRow: any) {
      const newUser = new UserKey(
          dbRow.public_address,
          dbRow.name,
          dbRow.public_key
      );
      console.dir(newUser);
      return newUser;
  }
}