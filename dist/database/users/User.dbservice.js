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
class UserDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.selectUserByPublicAddressQuery = {
            text: 'SELECT public_address, name from ' + userTableName + ' WHERE public_address = $1'
        };
        this.selectAllUsersQuery = {
            text: 'SELECT public_address, name from ' + userTableName
        };
        this.selectAllUsersExceptSelfQuery = {
            text: 'SELECT public_address, name from ' + userTableName + ' WHERE public_address != $1'
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
    selectUserByPublicAddress(publicAddress) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectUserByPublicAddressQuery;
            const values = [publicAddress];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    selectAllUsers() {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectAllUsersQuery;
            const values = [];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    selectAllUsersExceptSelf(publicAddress) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectAllUsersExceptSelfQuery;
            const values = [publicAddress];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    dbRowToDbModel(dbRow) {
        return User_dbmodel_1.User.dbRowToDbModel(dbRow);
    }
}
exports.UserDbService = UserDbService;
//# sourceMappingURL=User.dbservice.js.map