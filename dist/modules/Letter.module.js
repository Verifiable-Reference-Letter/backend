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
const Letter_dbservice_1 = require("../database/letters/Letter.dbservice");
const User_dbservice_1 = require("../database/users/User.dbservice");
const LetterDetails_model_1 = require("./LetterDetails.model");
const UserRole_1 = require("./UserRole");
const SentLetter_dbservice_1 = require("../database/sent_letters/SentLetter.dbservice");
class LetterModule {
    constructor() {
        this.usersDbService = new User_dbservice_1.UsersDbService();
        this.letterDbService = new Letter_dbservice_1.LetterDbService();
        this.sentLetterDbService = new SentLetter_dbservice_1.SentLetterDbService();
    }
    // Change to use altered ReceivedLetterDetails model that excludes recipients list
    selectAllSentLetterDetailsByRecipientAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const sentLetterModels = yield this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole_1.UserRole.Recipient);
            return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole_1.UserRole.Recipient);
        });
    }
    selectAllSentLetterDetailsByWriterAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const sentLetterModels = yield this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole_1.UserRole.Writer);
            return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole_1.UserRole.Writer);
        });
    }
    selectAllSentLetterDetailsByRequestorAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const sentLetterModels = yield this.letterDbService.selectAllLettersByAddressAndRole(address, UserRole_1.UserRole.Requestor);
            return this.transformLetterRowToLetterDetails(sentLetterModels, address, UserRole_1.UserRole.Requestor);
        });
    }
    transformLetterRowToLetterDetails(letterModels, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const letterDetailsModels = letterModels.map((letter) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const letterWriter = yield this.usersDbService.selectOneRowByPrimaryId(letter.letterWriter);
                    const letterRequestor = yield this.usersDbService.selectOneRowByPrimaryId(letter.letterRequestor);
                    const sentLetters = yield this.sentLetterDbService.selectAllSentLettersByLetterId(letter.letterId);
                    const letterRecipients = yield this.transformSentLettersToLetterRecipients(sentLetters);
                    const newLetterDetails = new LetterDetails_model_1.LetterDetails(letter.letterId, letterWriter, letterRequestor, letterRecipients);
                    return newLetterDetails;
                }
                catch (err) {
                    console.log(err.stack);
                }
            }));
            const letterDetailsPromise = Promise.all(letterDetailsModels).then((result) => {
                return result;
            });
            return letterDetailsPromise;
        });
    }
    transformSentLettersToLetterRecipients(sentLetters) {
        return __awaiter(this, void 0, void 0, function* () {
            const letterRecipientsPromise = Promise.all(sentLetters.map((sentLetter) => __awaiter(this, void 0, void 0, function* () {
                return yield this.usersDbService.selectOneRowByPrimaryId(sentLetter.recipientAddress);
            })));
            return letterRecipientsPromise;
        });
    }
}
exports.LetterModule = LetterModule;
//# sourceMappingURL=Letter.module.js.map