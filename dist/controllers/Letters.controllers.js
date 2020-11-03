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
const UserKey_dbservice_1 = require("../database/users/UserKey.dbservice");
const UserAuth_dbservice_1 = require("../database/users/UserAuth.dbservice");
const UserRole_1 = require("../database/users/UserRole");
const Letter_dbservice_1 = require("../database/letters/Letter.dbservice");
const Auth_module_1 = require("../modules/Auth.module");
const LetterContents_dbservice_1 = require("../database/letter_contents/LetterContents.dbservice");
const LetterRecipientContents_dbservice_1 = require("../database/letter_recipient_contents/LetterRecipientContents.dbservice");
const User_dbservice_1 = require("../database/users/User.dbservice");
const Emails_module_1 = require("../modules/Emails.module");
const router = express_1.default.Router();
exports.router = router;
const letterDbService = new Letter_dbservice_1.LetterDbService();
const letterHistoryDbService = new LetterHistory_dbservice_1.LetterHistoryDbService();
const letterContentsDbService = new LetterContents_dbservice_1.LetterContentsDbService();
const letterRecipientContentsDbService = new LetterRecipientContents_dbservice_1.LetterRecipientContentsDbService();
const userKeyDbService = new UserKey_dbservice_1.UserKeyDbService();
const userDbService = new User_dbservice_1.UserDbService();
const authModule = new Auth_module_1.AuthModule();
const userAuthDbService = new UserAuth_dbservice_1.UserAuthDbService();
const emailModule = new Emails_module_1.EmailsModule();
// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.use(Auth_module_1.AuthModule.verifyUser);
/**
 * get all letters for requestor along with num recipients for each letter
 */
router.post("/requested", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    // console.log(req.body["auth"]);
    // console.log("get letters for requestor");
    const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Requestor);
    // console.log(letterModels);
    // console.log("get num recipients for each letter");
    let numRecipients = [];
    // let numUnsentRecipients: Number[] = [];
    for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num = yield letterHistoryDbService.countSentRecipientsByLetterId(l.letterId);
        // const numUnsent: Number = await letterHistoryDbService.countUnsentRecipientsByLetterId(
        //   l.letterId
        // );
        numRecipients.push(num);
        // numUnsentRecipients.push(numUnsent);
    }
    if (letterModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {
                letters: letterModels,
                numRecipients: numRecipients,
            },
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * get all letters for writer along with num sent and unsent recipients for each letter
 */
router.post("/written", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("get letters for writer");
    const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Writer);
    // console.log(letterModels);
    // console.log("get num recipients for each letter");
    let numRecipients = [];
    let numUnsentRecipients = [];
    for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num = yield letterHistoryDbService.countSentRecipientsByLetterId(l.letterId);
        const numUnsent = yield letterHistoryDbService.countUnsentRecipientsByLetterId(l.letterId);
        numRecipients.push(num);
        numUnsentRecipients.push(numUnsent);
    }
    if (letterModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {
                letters: letterModels,
                numRecipients: numRecipients,
                numUnsentRecipients: numUnsentRecipients,
            },
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * get all letters for recipient
 */
router.post("/received", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("get letter history for recipient");
    const letterHistoryModels = yield letterHistoryDbService.selectAllLetterHistoryByLetterRecipient(res.locals.jwtPayload.publicAddress);
    // console.log(letterHistoryModels);
    if (letterHistoryModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: letterHistoryModels,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * get all requestors who have sent atleast one letter to the indicated recipient
 */
router.post("/receivedRequestors", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(res.locals.jwtPayload.publicAddress);
    const requestors = yield userDbService.selectAllLetterRequestorByLetterRecipient(res.locals.jwtPayload.publicAddress);
    if (requestors.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: requestors,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * get all letter history based on recipient's public address and requestor's public address since we group by requestor
 */
router.post("/received/:publicAddress", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const letterRequestor = req.params.publicAddress;
    const letterHistoryModels = yield letterHistoryDbService.selectAllLetterHistoryByLetterRecipientAndLetterRequestor(res.locals.jwtPayload.publicAddress, letterRequestor);
    if (letterHistoryModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: letterHistoryModels,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * get all letter history for a given letter id (for requestor and writer pages)
 */
router.post("/:letterId/history", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get letter history for given letter_id");
    const letterHistoryModels = yield letterHistoryDbService.selectAllSentLetterHistoryByLetterId(req.params.letterId);
    // console.log(letterHistoryModels);
    if (letterHistoryModels.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: letterHistoryModels,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: letterHistoryModels,
        });
    }
}));
/**
 * get all unsent letter history for a given letter id
 */
router.post("/:letterId/unsent", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get unsent letter history for given letter_id");
    const letterHistoryModels = yield letterHistoryDbService.selectAllUnsentLetterHistoryByLetterId(req.params.letterId);
    // console.log(letterHistoryModels);
    res.json({
        auth: {
            jwtToken: res.locals.newJwtToken,
        },
        data: letterHistoryModels,
    });
}));
/**
 * get all unsent letter recipients for a given letter id
 */
router.post("/:letterId/unsentRecipients", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    // console.log(req.body["auth"]);
    // console.log(req.params.letterId);
    // console.log("get unsent recipients for given letter_id");
    const userModels = yield userDbService.selectAllUnsentRecipientsByLetterId(req.params.letterId);
    // console.log(userModels);
    res.json({
        auth: {
            jwtToken: res.locals.newJwtToken,
        },
        data: userModels,
    });
}));
/**
 * update the recipients for a given letter id with an updated recipients list
 */
router.post("/:letterId/updateRecipients", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.letterId);
    // console.log("get unsent recipients for given letter_id");
    const success = yield letterHistoryDbService.updateRecipientsByLetterId(req.params.letterId, req.body["data"]);
    if (success) {
        const userModels = yield userDbService.selectAllUnsentRecipientsByLetterId(req.params.letterId);
        // console.log(userModels);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: userModels,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * make a new request (for a letter) with indicated writer and recipients list (for requestor's page)
 */
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
            yield emailModule.sendEmailToWriter(res.locals.jwtPayload.publicAddress, data.letterWriter);
            const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Requestor);
            let numRecipients = [];
            // let numUnsentRecipients: Number[] = [];
            for (let i = 0; i < letterModels.length; i++) {
                const l = letterModels[i];
                const num = yield letterHistoryDbService.countSentRecipientsByLetterId(l.letterId);
                // const numUnsent: Number = await letterHistoryDbService.countUnsentRecipientsByLetterId(
                //   l.letterId
                // );
                numRecipients.push(num);
                // numUnsentRecipients.push(numUnsent);
            }
            res.json({
                auth: {
                    jwtToken: res.locals.newJwtToken,
                },
                data: {
                    letters: letterModels,
                    numRecipients: numRecipients,
                },
            });
        }
        else {
            res.status(400);
            res.json({
                auth: {
                    jwtToken: res.locals.newJwtToken,
                },
                data: {},
            });
        }
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
/**
 * retrieve the letter contents by letter id and writer id (for writer's page view functionality)
 */
router.post("/:letterId/contents/writer", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    var _a;
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("get letter contents for given letterId");
    // TODO: make sure below function checks that letterId is valid id for this user to update
    const letterContents = yield letterContentsDbService.selectLetterContentsByLetterIdAndWriterId(req.params.letterId, req.body["auth"].publicAddress);
    console.log(letterContents.length);
    if (letterContents && letterContents.length > 0) {
        console.log((_a = letterContents[0].contents) === null || _a === void 0 ? void 0 : _a.length);
        res.json({ data: letterContents[0].contents });
    }
    else {
        res.status(400);
        res.json({ data: {} });
    }
}));
// /**
//  * retrieve the letter contents by letter id and recipient id (for recipient's page view functionality)
//  */
// router.post("/:letterId/contents/recipient", async (req, res, next) => {
//   // TODO: check JWT
//   console.log(req.body["auth"]);
//   console.log(req.params.letterId);
//   console.log("get letter contents for given letterId");
//   const letterContents: LetterContents[] = await letterContentsDbService.selectLetterContentsByLetterIdAndRecipientId(
//     req.params.letterId,
//     req.body["auth"].publicAddress
//   );
//   if (letterContents && letterContents.length > 0) {
//     console.log(letterContents[0].contents?.length);
//     res.json({ data: letterContents[0].contents });
//   } else {
//     res.status(400);
//     res.json({ data: {} });
//   }
// });
/**
 * update the letter contents for given letter id and writer id after checking if not sent to any recipients
 */
router.post("/:letterId/contents/update", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check JWT
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("update letter contents for given letterId");
    const currentDate = Date();
    const numRecipients = yield letterHistoryDbService.countSentRecipientsByLetterId(req.params.letterId);
    // check if not sent to any recipients (not allowing changing of letter contents after atleast 1 sent)
    if (numRecipients === 0) {
        const success = yield letterContentsDbService.updateLetterContentsByLetterIdAndWriterId(req.body["data"], currentDate, req.params.letterId, req.body["auth"].publicAddress);
        console.log(success);
        if (!success) {
            res.status(400);
            res.json({ data: {} });
        }
        else {
            // res.json({ data: {} });
            const letters = yield letterDbService.selectAllLettersByAddressAndRole(req.body["auth"].publicAddress, UserRole_1.UserRole.Writer);
            const letter = yield letterDbService.selectOneRowByPrimaryId(req.params.letterId);
            if (letters) {
                yield emailModule.sendEmailToRequestor(letter.letterRequestor.publicAddress, res.locals.jwtPayload.publicAddress);
                res.json({
                    auth: {
                        jwtToken: res.locals.newJwtToken,
                    },
                    data: letters,
                });
            }
            else {
                res.status(400);
                res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: {} });
            }
        }
    }
    else {
        console.log("invalid action: not allowed to update letter content of letter already sent to >= 1 recipient");
        res.status(400);
        res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: {} });
    }
}));
/**
 * retrieve all the unsent recipients with their public keys (userkey) for the indicated letter id
 */
router.post("/:letterId/unsentRecipientKeys", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userKeyModels = yield userKeyDbService.selectAllUnsentRecipientKeysByLetterId(req.params.letterId);
    console.log(userKeyModels.length);
    if (userKeyModels.length === 0) {
        res.status(400);
        res.json({ data: {} });
    }
    else {
        res.json({ data: { userKeys: userKeyModels } });
    }
}));
/**
 * retrieve the encrypted contents, hash, and signature for a given letter_id and recipient id
 */
router.post("/:letterId/recipientContents", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const letterRecipientContents = yield letterRecipientContentsDbService.selectLetterContentsByLetterIdAndRecipientId(req.params.letterId, res.locals.jwtPayload.publicAddress);
    // console.log(letterRecipientContents);
    if (letterRecipientContents.length === 0 || letterRecipientContents[0].letterContents === null || letterRecipientContents[0].letterSignature === null) {
        res.status(400);
        res.json({ data: {} });
    }
    else {
        const verifySuccess = yield authModule.verifySignature(letterRecipientContents[0].letterContents, letterRecipientContents[0].letterSignature, res.locals.jwtPayload.publicAddress);
        if (verifySuccess) {
            yield res.json({ data: { letterRecipientContents: letterRecipientContents } });
        }
        else {
            console.log(verifySuccess, "something went wrong with verification");
            res.status(500);
            res.json({ data: {} });
        }
    }
}));
/**
 * update the encrypted contents, hash, and recipient for a given letter_id and recipient_id
 */
router.post("/:letterId/recipientContents/update", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body["data"];
    const verifySuccess = yield authModule.verifySignature(data.letterContents, data.letterSignature, res.locals.jwtPayload.publicAddress);
    if (verifySuccess) {
        const currentDate = Date();
        const success = yield letterRecipientContentsDbService.updateLetterContentsByLetterIdAndRecipientId(data.letterContents, 
        // data.letterHash,
        data.letterSignature, currentDate, req.params.letterId, data.letterRecipient);
        if (!success) {
            res.status(400);
            res.json({ data: {} });
        }
        else {
            const letterModels = yield letterDbService.selectAllLettersByAddressAndRole(res.locals.jwtPayload.publicAddress, UserRole_1.UserRole.Writer);
            let numRecipients = [];
            let numUnsentRecipients = [];
            for (let i = 0; i < letterModels.length; i++) {
                const l = letterModels[i];
                const num = yield letterHistoryDbService.countSentRecipientsByLetterId(l.letterId);
                const numUnsent = yield letterHistoryDbService.countUnsentRecipientsByLetterId(l.letterId);
                numRecipients.push(num);
                numUnsentRecipients.push(numUnsent);
            }
            if (letterModels.length !== 0) {
                res.json({
                    auth: {
                        jwtToken: res.locals.newJwtToken,
                    },
                    data: {
                        letters: letterModels,
                        numRecipients: numRecipients,
                        numUnsentRecipients: numUnsentRecipients,
                    },
                });
            }
            else {
                res.status(400);
                res.json({
                    auth: {
                        jwtToken: res.locals.newJwtToken,
                    },
                    data: {},
                });
            }
        }
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: {},
        });
    }
}));
//# sourceMappingURL=Letters.controllers.js.map