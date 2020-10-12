export class UserProfile {
  publicAddress: string;
  name: string;
  profileImage: Buffer;
  createdAt: Date;

  constructor(
    publicAddress: string,
    name: string,
    profileImage: Buffer,
    createdAt: Date
  ) {
    this.publicAddress = publicAddress;
    this.name = name;
    this.profileImage = profileImage;
    this.createdAt = createdAt;
  }

  static dbRowToDbModel(dbRow: any) {
    const newUser = new UserProfile(
      dbRow.public_address,
      dbRow.name,
      dbRow.profile_image,
      dbRow.created_at
    );
    console.dir(newUser);
    return newUser;
  }
}
