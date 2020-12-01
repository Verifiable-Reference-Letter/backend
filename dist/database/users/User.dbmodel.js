"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(publicAddress, name) {
        this.publicAddress = publicAddress;
        this.name = name;
    }
    static dbRowToDbModel(dbRow) {
        const newUser = new User(dbRow.public_address, dbRow.name);
        console.dir(newUser);
        return newUser;
    }
}
exports.User = User;
//# sourceMappingURL=User.dbmodel.js.map