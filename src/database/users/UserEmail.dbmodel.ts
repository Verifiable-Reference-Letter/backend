export class UserEmail {

    publicAddress: string;
    name: string;
    email: string;
    isEmailVerified: boolean;

    constructor(
        publicAddress: string,
        name: string,
        email: string,
        isEmailVerified: boolean
    ) {
            this.publicAddress = publicAddress;
            this.name = name;
            this.email = email;
            this.isEmailVerified = isEmailVerified;
            console.log(this.isEmailVerified);
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new UserEmail(
            dbRow.public_address,
            dbRow.name,
            dbRow.email,
            dbRow.is_email_verified
        );
        return newUser;
    }
}