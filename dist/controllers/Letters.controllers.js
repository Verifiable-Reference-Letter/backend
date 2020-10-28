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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const LetterHistory_dbservice_1 = require("../database/letter_history/LetterHistory.dbservice");
const UserRole_1 = require("../database/users/UserRole");
const Letter_dbservice_1 = require("../database/letters/Letter.dbservice");
const Auth_module_1 = require("../modules/Auth.module");
const router = express_1.default.Router();
exports.router = router;
const letterDbService = new Letter_dbservice_1.LetterDbService();
const letterHistoryDbService = new LetterHistory_dbservice_1.LetterHistoryDbService();
// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.use(Auth_module_1.AuthModule.verifyUser);
router.post("/requested", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    // console.log(req.body["auth"]);
    // console.log("get letters for requestor");
    const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Requestor);
    // console.log(letterModels);
    // console.log("get num recipients for each letter");
    let numRecipients = [];
    for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num = yield letterHistoryDbService.countRecipientsByLetterId(l.letterId);
        numRecipients.push(num);
    }
    // console.log(numRecipients);
    if (letterModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: {
                letters: letterModels,
                numRecipients: numRecipients
            }
        });
    }
    else {
        res.status(400);
    }
}));
router.post("/written", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("get letters for writer");
    const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Writer);
    // console.log(letterModels);
    // console.log("get num recipients for each letter");
    let numRecipients = [];
    for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num = yield letterHistoryDbService.countRecipientsByLetterId(l.letterId);
        numRecipients.push(num);
    }
    // console.log(numRecipients);
    if (letterModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: {
                letters: letterModels,
                numRecipients: numRecipients
            }
        });
    }
    else {
        res.status(400);
    }
}));
router.post("/received", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("get letter history for recipient");
    const letterHistoryModels = yield letterHistoryDbService.selectAllLetterHistoryByLetterRecipient(res.locals.jwtPayload.publicAddress);
    // console.log(letterHistoryModels);
    if (letterHistoryModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: letterHistoryModels
        });
    }
    else {
        res.status(400);
    }
}));
router.post("/:letterId/history", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get letter history for given letter_id");
    const letterHistoryModels = yield letterHistoryDbService.selectAllSentLetterHistoryByLetterId(req.params.letterId);
    // console.log(letterHistoryModels);
    if (letterHistoryModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: letterHistoryModels
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: letterHistoryModels
        });
    }
}));
router.post("/:letterId/unsent", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get unsent letter history for given letter_id");
    const letterHistoryModels = yield letterHistoryDbService.selectAllUnsentLetterHistoryByLetterId(req.params.letterId);
    // console.log(letterHistoryModels);
    res.json({
        auth: {
            jwtToken: res.locals.newJwtToken
        },
        data: letterHistoryModels
    });
}));
router.post("/:letterId/unsentRecipients", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    // console.log(req.body["auth"]);
    // console.log(req.params.letterId);
    // console.log("get unsent recipients for given letter_id");
    const userModels = yield letterHistoryDbService.selectAllUnsentRecipientsByLetterId(req.params.letterId);
    // console.log(userModels);
    res.json({
        auth: {
            jwtToken: res.locals.newJwtToken
        },
        data: userModels
    });
}));
router.post("/:letterId/updateRecipients", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get unsent recipients for given letter_id");
    const success = yield letterHistoryDbService.updateRecipientsByLetterId(req.params.letterId, req.body["data"]);
    if (success) {
        const userModels = yield letterHistoryDbService.selectAllUnsentRecipientsByLetterId(req.params.letterId);
        // console.log(userModels);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: userModels
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: {}
        });
    }
}));
router.post("/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("creating new letter based on letter details");
    const data = req.body["data"];
    // console.log(data);
    // const letterId = Math.random().toString(36);
    const currentDate = Date();
    // // console.log(currentDate);
    // // console.log(new Date(currentDate));
    // const letterId = (currentDate + Math.random()).substring(0, 36);
    const letterId = uuid_1.v4();
    // console.log(letterId);
    const insertLetterSuccess = yield letterDbService.insertLetterByAddressAndLetterDetails(letterId, res.locals.jwtPayload.publicAddress, data.letterWriter, currentDate);
    // console.log("insertLetterSuccess", insertLetterSuccess);
    if (insertLetterSuccess) {
        const insertSentLetterSuccess = yield letterHistoryDbService.insertRecipientsByLetterId(letterId, data.selectedRecipients);
        // console.log("insertSentLetterSuccess", insertSentLetterSuccess);
        if (insertSentLetterSuccess) {
            const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Requestor);
            let numRecipients = [];
            for (let i = 0; i < letterModels.length; i++) {
                const l = letterModels[i];
                const num = yield letterHistoryDbService.countRecipientsByLetterId(l.letterId);
                numRecipients.push(num);
            }
            // console.log(letterModels);
            // console.log(numRecipients);
            res.json({
                auth: {
                    jwtToken: res.locals.newJwtToken
                },
                data: {
                    letters: letterModels,
                    numRecipients: numRecipients
                }
            });
        }
        else {
            res.status(400);
            res.json({
                auth: {
                    jwtToken: res.locals.newJwtToken
                },
                data: {}
            });
        }
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken
            },
            data: {}
        });
    }
}));
router.post("/:letterId/contents/writer", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    var _a;
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("get letter contents for given letterId");
    // TODO: make sure below function checks that letterId is valid id for this user to update
    const letterContents = yield letterDbService.selectLetterContentsByLetterIdAndWriterId(req.params.letterId, req.body["auth"].publicAddress);
    console.log(letterContents.length);
    if (letterContents && letterContents.length > 0) {
        console.log((_a = letterContents[0].content) === null || _a === void 0 ? void 0 : _a.length);
        res.json({ data: letterContents[0].content });
    }
    else {
        res.status(400);
        res.json({ data: {} });
    }
}));
router.post("/:letterId/contents/recipient", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // TODO: check JWT
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("get letter contents for given letterId");
    const letterContents = yield letterHistoryDbService.selectLetterContentsByLetterIdAndRecipientId(req.params.letterId, req.body["auth"].publicAddress);
    console.log(letterContents.length);
    if (letterContents && letterContents.length > 0) {
        console.log((_b = letterContents[0].content) === null || _b === void 0 ? void 0 : _b.length);
        res.json({ data: letterContents[0].content });
    }
    else {
        res.status(400);
        res.json({ data: {} });
    }
}));
router.post("/:letterId/contents/update", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("update letter contents for given letterId");
    const currentDate = Date();
    const numRecipients = yield letterHistoryDbService.countRecipientsByLetterId(req.params.letterId);
    if (numRecipients === 0) {
        const success = yield letterDbService.updateLetterContentsByLetterIdAndWriterId(req.body["data"], currentDate, req.params.letterId, req.body["auth"].publicAddress);
        console.log(success);
        if (!success) {
            res.status(400);
            res.json({ data: {} });
        }
        else {
            // res.json({ data: {} });
            const letters = yield letterDbService.selectAllLettersByAddressAndRole(req.body["auth"].publicAddress, UserRole_1.UserRole.Writer);
            if (letters) {
                res.json({ data: letters });
            }
            else {
                res.status(400);
                res.json({ data: {} });
            }
        }
    }
    else {
        console.log("invalid action: not allowed to update letter content of letter already sent to >= 1 recipient");
        res.status(400);
        res.json({ data: {} });
    }
}));
//# sourceMappingURL=Letters.controllers.js.map