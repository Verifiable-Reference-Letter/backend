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
const SentLetter_dbmodel_1 = require("./SentLetter.dbmodel");
const sentLetterTableName = "sent_letters";
class SentLetterDbService extends dbservice_1.DatabaseService {
    constructor() {
        super();
        this.selectAllSentLettersByLetterIdQuery = {
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE letter_id = $1'
        };
        this.selectAllSentLettersByRecipientQuery = {
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE public_address = $1'
        };
        this.initializePreparedQueries();
    }
    initializePreparedQueries() {
        this.selectAllQuery = {
            text: "SELECT * from " + sentLetterTableName
        };
        this.selectOneRowByIdQuery = {
            text: 'SELECT * from ' + sentLetterTableName + ' WHERE public_address = $1'
        };
    }
    selectAllSentLettersByRecipientAddress(id) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const values = [id];
            return _super.runParameterizedQueryWithValuesArray.call(this, this.selectAllSentLettersByRecipientQuery, values);
        });
    }
    selectAllSentLettersByLetterId(id) {
        const _super = Object.create(null, {
            runParameterizedQueryWithValuesArray: { get: () => super.runParameterizedQueryWithValuesArray }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const values = [id];
            return _super.runParameterizedQueryWithValuesArray.call(this, this.selectAllSentLettersByLetterIdQuery, values);
        });
    }
    dbRowToDbModel(dbRow) {
        return SentLetter_dbmodel_1.SentLetter.dbRowToDbModel(dbRow);
    }
}
exports.SentLetterDbService = SentLetterDbService;
//# sourceMappingURL=SentLetter.dbservice.js.map