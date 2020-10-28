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
const Letter_dbmodel_1 = require("./Letter.dbmodel");
const UserRole_1 = require("../users/UserRole");
const letterTableName = "letters";
const userTableName = "users";
class LetterDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.selectAllLettersByRequestorIdQuery = {
            text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
                letterTableName +
                " as L inner join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address where letter_requestor = $1 order by L.requested_at DESC;",
        };
        this.selectAllLettersByWriterIdQuery = {
            text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
                letterTableName +
                " as L inner join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address where letter_writer = $1 order by L.requested_at DESC;",
        };
        this.selectLetterByLetterIdAndRequestorIdQuery = {
            text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
                letterTableName +
                " as L inner join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address where letter_id = $1 and letter_requestor = $2;",
        };
        this.selectLetterByLetterIdAndWriterIdQuery = {
            text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
                letterTableName +
                " as L inner join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address where letter_id = $1 and letter_writer = $2;",
        };
        this.insertLetterByAddressAndLetterDetailsQuery = {
            text: "insert into " +
                letterTableName +
                "(letter_id, letter_requestor, letter_writer, requested_at, uploaded_at) values($1, $2, $3, $4, $5);",
        };
    }
    /**
     * select all letters for either requestor or writer by public address
     * @param publicAddress
     * @param userRole
     */
    selectAllLettersByAddressAndRole(publicAddress, userRole) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.getQueryTextByUserRole(userRole);
            const values = [publicAddress];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    /**
     * select a letter by address, letter id, and user role
     * @param publicAddress
     * @param letterId
     * @param userRole
     */
    selectLetterByAddressAndLetterId(publicAddress, letterId, userRole) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (userRole === UserRole_1.UserRole.Requestor) {
                const queryText = this.selectLetterByLetterIdAndRequestorIdQuery;
                const values = [publicAddress, letterId];
                return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
            }
            else if (userRole == UserRole_1.UserRole.Writer) {
                const queryText = this.selectLetterByLetterIdAndWriterIdQuery;
                const values = [publicAddress, letterId];
                return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
            }
        });
    }
    /**
     * creation of new letter
     * insert a letter based on letter details
     * @param letterId
     * @param letterRequestor
     * @param letterWriter writer's public address
     * @param currentDate
     */
    insertLetterByAddressAndLetterDetails(letterId, letterRequestor, letterWriter, currentDate) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArrayInsert: { get: () => super.runParameterizedQueryWithValuesArrayInsert }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.insertLetterByAddressAndLetterDetailsQuery;
            const values = [
                letterId,
                letterRequestor,
                letterWriter,
                currentDate.substring(0, 24),
                null,
            ];
            return _super.runParameterizedQueryWithValuesArrayInsert.call(this, queryText, values);
        });
    }
    /**
     * helper for the select all letter method
     * determine query based off user role
     * @param userRole requestor or writer
     */
    getQueryTextByUserRole(userRole) {
        if (userRole.valueOf() === UserRole_1.UserRole.Requestor.valueOf()) {
            return this.selectAllLettersByRequestorIdQuery;
        }
        else if (userRole.valueOf() === UserRole_1.UserRole.Writer.valueOf()) {
            return this.selectAllLettersByWriterIdQuery;
        }
    }
    dbRowToDbModel(dbRow) {
        return Letter_dbmodel_1.Letter.dbRowToDbModel(dbRow);
    }
}
exports.LetterDbService = LetterDbService;
//# sourceMappingURL=Letter.dbservice.js.map