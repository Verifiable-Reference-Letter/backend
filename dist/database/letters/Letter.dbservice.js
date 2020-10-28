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
const sentLetterTableName = "sent_letters";
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
                " as V on L.letter_writer = V.public_address where letter_requestor = $1;",
        };
        this.selectAllLettersByWriterIdQuery = {
            text: "select distinct L.letter_id, L.letter_requestor, U.name as letter_requestor_name, L.letter_writer, V.name as letter_writer_name, L.requested_at, L.uploaded_at from " +
                letterTableName +
                " as L inner join " +
                userTableName +
                " as U on L.letter_requestor = U.public_address join " +
                userTableName +
                " as V on L.letter_writer = V.public_address where letter_writer = $1;",
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
        this.selectLetterContentsByLetterIdAndWriterIdQuery = {
            text: "select letter_contents from " +
                letterTableName +
                " where letter_id = $1 and letter_writer = $2",
        };
        this.updateLetterContentsByLetterIdAndWriterIdQuery = {
            text: "update " +
                letterTableName +
                " set letter_contents = $1, uploaded_at = $2 where letter_id = $3 and letter_writer = $4;",
        };
        this.insertLetterByAddressAndLetterDetailsQuery = {
            text: "insert into " +
                letterTableName +
                "(letter_id, letter_requestor, letter_writer, requested_at, uploaded_at) values($1, $2, $3, $4, $5);",
        };
    }
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
    selectLetterByAddressAndLetterId(publicAddress, letterId, role) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (role === UserRole_1.UserRole.Requestor) {
                const queryText = this.selectLetterByLetterIdAndRequestorIdQuery;
                const values = [publicAddress, letterId];
                return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
            }
            else if (role == UserRole_1.UserRole.Writer) {
                const queryText = this.selectLetterByLetterIdAndWriterIdQuery;
                const values = [publicAddress, letterId];
                return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
            }
        });
    }
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
    selectLetterContentsByLetterIdAndWriterId(letterId, letterWriter) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArrayContents: { get: () => super.runParameterizedQueryWithValuesArrayContents }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.selectLetterContentsByLetterIdAndWriterIdQuery;
            const values = [letterId, letterWriter];
            return _super.runParameterizedQueryWithValuesArrayContents.call(this, queryText, values);
        });
    }
    updateLetterContentsByLetterIdAndWriterId(letterContents, currentDate, letterId, letterWriter) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArrayUpdate: { get: () => super.runParameterizedQueryWithValuesArrayUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log(letterContents.length);
            const letterContentObj = Buffer.from(letterContents, 'utf8');
            const queryText = this.updateLetterContentsByLetterIdAndWriterIdQuery;
            const values = [letterContentObj, currentDate.substring(0, 24), letterId, letterWriter];
            return _super.runParameterizedQueryWithValuesArrayUpdate.call(this, queryText, values);
        });
    }
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