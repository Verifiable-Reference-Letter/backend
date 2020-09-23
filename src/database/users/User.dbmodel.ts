export class User {

    publicAddress: string;
    name: string;
    creationTimestamp: Date;
    nonce: string;

    constructor(
        publicAddress: string,
        name: string,
        creationTimestamp: Date,
        nonce: string
    ) {
            this.publicAddress = publicAddress;
            this.name = name;
            this.creationTimestamp = creationTimestamp;
            this.nonce = nonce;
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new User(
            dbRow.public_address,
            dbRow.name,
            dbRow.creation_timestamp,
            dbRow.nonce
        );
        console.dir(newUser);
        return newUser;
    }
}