export class UserEmail {

    publicAddress: string;
    name: string;
    email: string;
    emailVerified: boolean;

    constructor(
        publicAddress: string,
        name: string,
        email: string,
        emailVerified: boolean
    ) {
            this.publicAddress = publicAddress;
            this.name = name;
            this.email = name;
            this.emailVerified = emailVerified;
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new UserEmail(
            dbRow.public_address,
            dbRow.name,
            dbRow.email,
            dbRow.emailVerified
        );
        return newUser;
    }
}