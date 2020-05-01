export class User {

    userId: string;
    username: string;
    publicAddress: string;
    creationTimestamp: Date;

    constructor(
        userId: string,
        username: string,
        publicAddress: string,
        creationTimestamp: Date) {
            this.userId = userId;
            this.username = username;
            this.publicAddress = publicAddress;
            this.creationTimestamp = creationTimestamp;
    }

    static dbRowToDbModel(dbRow: any) {
        const newUser = new User(
            dbRow.user_id,
            dbRow.name,
            dbRow.public_address,
            dbRow.creation_timestamp
        );
        console.dir(newUser);
        return newUser;
    }

    convertToClientModel() {
        return {
            user_id: this.userId,
            name: this.username,
            public_key: this.publicAddress,
            creation_timestamp: this.creationTimestamp
        };
    }

}