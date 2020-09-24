"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbservice_1 = require("../dbservice");
const User_dbmodel_1 = require("./User.dbmodel");
const userTableName = "users";
class UsersDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.createUserQuery = {
            text: 'insert into users values ($1, $2, current_timestamp, 0) returning *;'
        };
        this.initializePreparedQueries();
    }
    initializePreparedQueries() {
        this.selectAllQuery = {
            text: "SELECT * from " + userTableName
        };
        this.selectOneRowByIdQuery = {
            text: 'SELECT * from ' + userTableName + ' WHERE public_address = $1'
        };
    }
    dbRowToDbModel(dbRow) {
        return User_dbmodel_1.User.dbRowToDbModel(dbRow);
    }
    createUser(address, name) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const values = [address, name];
            let users = yield _super.runParameterizedQueryWithValuesArray.call(this, this.createUserQuery, values);
            return users[0];
        });
    }
}
exports.UsersDbService = UsersDbService;
//# sourceMappingURL=User.dbservice.js.map