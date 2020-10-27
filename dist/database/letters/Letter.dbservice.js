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
const UserRole_1 = require("../../modules/UserRole");
const sentLetterTableName = "sent_letters";
const letterTableName = "letters";
class LetterDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.selectAllLettersByRecipientIdQuery = {
            text: 'select letter_id, letter_writer, letter_requestor from ' + letterTableName + ' natural left join ' + sentLetterTableName + ' where public_address = $1;'
        };
        this.selectAllLettersByRequestorIdQuery = {
            text: 'select * from ' + letterTableName + ' where letter_requestor = $1;'
        };
        this.selectAllLettersByWriterIdQuery = {
            text: 'select * from ' + letterTableName + ' where letter_writer = $1;'
        };
    }
    selectAllLettersByAddressAndRole(address, userRole) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = this.getQueryTextByUserRole(userRole);
            const values = [address];
            return _super.runParameterizedQueryWithValuesArray.call(this, queryText, values);
        });
    }
    getQueryTextByUserRole(userRole) {
        if (userRole.valueOf() === UserRole_1.UserRole.Recipient.valueOf()) {
            return this.selectAllLettersByRecipientIdQuery;
        }
        else if (userRole.valueOf() === UserRole_1.UserRole.Requestor.valueOf()) {
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