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
const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
const userTableName = "users";
class UserDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.selectUserByPublicAddressQuery = {
            text: "SELECT public_address, name from " +
                userTableName +
                " WHERE public_address = $1",
        };
        this.selectAllUsersQuery = {
            text: "SELECT public_address, name from " +
                userTableName +
                " order by name ASC",
        };
        this.selectAllUsersExceptSelfQuery = {
            text: "SELECT public_address, name from " +
                userTableName +
                " WHERE public_address != $1 order by name ASC",
        };
        this.selectAllLetterRequestorByLetterRecipientQuery = {
            text: "select distinct on (letter_requestor) letter_requestor as public_address, letter_requestor_name as name from (select distinct L.letter_requestor, U.name as letter_requestor_name, S.sent_at from " +
                letterTableName +
                " as L inner join " +
                sentLetterTableName +
                " as S on L.letter_id = S.letter_id join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address join " +
                userTableName +
                " as W on S.letter_recipient = W.public_address where S.letter_recipient = $1 order by S.sent_at DESC ) subquery;",
        };
        this.selectAllUnsentRecipientsByLetterIdQuery = {
            text: "select distinct W.public_address, W.name from " +
                letterTableName +
                " as L inner join " +
                sentLetterTableName +
                " as S on L.letter_id = S.letter_id join " +
                userTableName +
                " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is NULL order by W.public_address ASC;",
        };
        this.selectUserEmailQuery = {
            text: "select email from " +
                userTableName +
                "where public_address = $1"
        };
        this.selectAllSentRecipientsByLetterIdQuery = {
            text: "select distinct W.public_address, W.name from " +
                letterTableName +
                " as L inner join " +
                sentLetterTableName +
                " as S on L.letter_id = S.letter_id join " +
                userTableName +
                " as W on S.letter_recipient = W.public_address where L.letter_id = $1 and S.sent_at is not NULL order by W.public_address ASC;",
        };
        this.initializePreparedQueries();
    }
    initializePreparedQueries() {
        this.selectAllQuery = {
            text: "SELECT * from " + userTableName,
        };
        this.selectOneRowByIdQuery = {
            text: "SELECT * from " + userTableName + " WHERE public_address = $1",
        };
    }
    /**
     * retrieve an user by public address
     * @param publicAddress
     */
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
    /**
     * retrieve all users
     */
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
    /**
     * retrieve all users but exclude self
     * i.e cannot request letter to self
     * @param publicAddress
     */
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
    /**
     * retrieve all requestors who have sent a letter to the recipient
     * @param publicAddress of recipient
     */
    selectAllLetterRequestorByLetterRecipient(publicAddress) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectAllLetterRequestorByLetterRecipientQuery;
            const values = [publicAddress];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    /**
     * unsent recipients
     * retrieval of all unsent letter recipients (Users) rather than full letter history
     * for a given letter id (for either requestor or writer)
     * @param letterId
     */
    selectAllUnsentRecipientsByLetterId(letterId) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectAllUnsentRecipientsByLetterIdQuery;
            const values = [letterId];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    selectUserEmail(publicAddress) {
        const _super = Object.create(null, {
            runParameterizedQueryReturningSingleRow: { get: () => super.runParameterizedQueryReturningSingleRow }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectUserEmailQuery;
            const values = [publicAddress];
            const email = this.dbResultToEmail(_super.runParameterizedQueryReturningSingleRow.call(this, queryText, values));
            return email;
        });
    }
    /**
     * sent recipients
     * retrieval of all unsent letter recipients (Users) rather than full letter history
     * for a given letter id (for either requestor or writer)
     * @param letterId
     */
    selectAllSentRecipientsByLetterId(letterId) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectAllSentRecipientsByLetterIdQuery;
            const values = [letterId];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    dbResultToEmail(dbRow) {
        return dbRow.email;
    }
    dbRowToDbModel(dbRow) {
        return User_dbmodel_1.User.dbRowToDbModel(dbRow);
    }
}
exports.UserDbService = UserDbService;
//# sourceMappingURL=User.dbservice.js.map