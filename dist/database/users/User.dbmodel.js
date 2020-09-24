"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(publicAddress, name, creationTimestamp, nonce) {
        this.publicAddress = publicAddress;
        this.name = name;
        this.creationTimestamp = creationTimestamp;
        this.nonce = nonce;
    }
    static dbRowToDbModel(dbRow) {
        const newUser = new User(dbRow.public_address, dbRow.name, dbRow.creation_timestamp, dbRow.nonce);
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
exports.User = User;
//# sourceMappingURL=User.dbmodel.js.map