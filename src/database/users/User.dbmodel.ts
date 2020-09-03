export class User {

    publicAddress: string;
    name: string;
    creationTimestamp: Date;
    nonce: Number;

    constructor(
        publicAddress: string,
        name: string,
        creationTimestamp: Date,
        nonce: Number
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

    convertToClientModel() {
        return {
            public_address: this.publicAddress,
            name: this.name,
            creation_timestamp: this.creationTimestamp,
            nonce: this.nonce
        };
    }

}