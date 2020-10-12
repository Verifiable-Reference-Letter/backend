export class UserAuth {

    publicAddress: string;
    name: string;
    nonce: string;

    constructor(
        publicAddress: string,
        name: string,
        nonce: string
    ) {
            this.publicAddress = publicAddress;
            this.name = name;
            this.nonce = nonce;
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new UserAuth(
            dbRow.public_address,
            dbRow.name,
            dbRow.nonce
        );
        console.dir(newUser);
        return newUser;
    }
}