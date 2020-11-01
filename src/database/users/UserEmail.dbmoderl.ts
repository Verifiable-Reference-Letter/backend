export class UserEmail {

    publicAddress: string;
    email: string;
    emailVerified: boolean;

    constructor(
        publicAddress: string,
        email: string,
        emailVerified: boolean
    ) {
            this.publicAddress = publicAddress;
            this.email = name;
            this.emailVerified = emailVerified;
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new UserEmail(
            dbRow.public_address,
            dbRow.email,
            dbRow.emailVerified
        );
        return newUser;
    }
}