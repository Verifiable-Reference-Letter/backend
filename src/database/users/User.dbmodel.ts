export class User {

  publicAddress: string;
  name: string;
  email: string;
  profileImage: Buffer | null;
  createdAt: Date;
  nonce: string;
  publicKey: string; 

  constructor(
      publicAddress: string,
      name: string,
      email: string,
      profileImage: Buffer | null,
      createdAt: Date,
      nonce: string,
      public_key: string
  ) {
          this.publicAddress = publicAddress;
          this.name = name;
          this.email = email;
          this.profileImage = profileImage;
          this.createdAt = createdAt;
          this.nonce = nonce;
          this.publicKey = public_key;
  }

  static dbRowToDbModel(dbRow: any) {
      const newUser = new User(
          dbRow.public_address,
          dbRow.name,
          dbRow.email,
          dbRow.profileImage,
          dbRow.createdAt,
          dbRow.nonce,
          dbRow.public_key
      );
      console.dir(newUser);
      return newUser;
  }
}