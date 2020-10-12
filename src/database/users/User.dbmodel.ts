export class User {

  publicAddress: string;
  name: string;

  constructor(
      publicAddress: string,
      name: string,
  ) {
          this.publicAddress = publicAddress;
          this.name = name;
  }

  static dbRowToDbModel(dbRow: any) {
      const newUser = new User(
          dbRow.public_address,
          dbRow.name,
      );
      console.dir(newUser);
      return newUser;
  }
}