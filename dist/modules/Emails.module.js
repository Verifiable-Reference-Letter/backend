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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const UserEmail_dbservice_1 = require("../database/users/UserEmail.dbservice");
const jwt = __importStar(require("jsonwebtoken"));
const userEmailDbService = new UserEmail_dbservice_1.UserEmailDbService();
const jwtKey = "my private key";
class EmailsModule {
    constructor() {
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    }
    sendEmailToWriter(requestorAddress, writerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestor = yield userEmailDbService.selectOneRowByPrimaryId(requestorAddress);
            const writer = yield userEmailDbService.selectOneRowByPrimaryId(writerAddress);
            this.sendEmail(writer.email, 'verifiablereferenceletter@gmail.com', 'Letter Request', `${requestor.name} has requested a letter from you.`);
        });
    }
    sendEmailToRequestor(requestorAddress, writerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestor = yield userEmailDbService.selectOneRowByPrimaryId(requestorAddress);
            const writer = yield userEmailDbService.selectOneRowByPrimaryId(writerAddress);
            this.sendEmail(requestor.email, 'verifiablereferenceletter@gmail.com', 'Your requested letter has been uploaded', `${writer.name} has uploaded updates to your letter. You can start select recipients and send the letter securely and safely on the dApp now!`);
        });
    }
    sendVerificationEmail(publicAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userEmailDbService.selectOneRowByPrimaryId(publicAddress);
            const jwtToken = jwt.sign({ publicAddress }, jwtKey, {
                algorithm: "HS256",
                expiresIn: "1h",
            });
            this.sendEmail(user.email, 'verifiablereferenceletter@gmail.com', 'Please verify your email', `Click this link to verify your email on the letter sending dApp: <a href="https://www.verifiable-reference-letter.herokuapp.com/auth/verifyEmail/${jwtToken}">`);
        });
    }
    sendEmail(toEmail, fromEmail, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = {
                to: toEmail,
                from: fromEmail,
                subject: subject,
                html: html,
            };
            return mail_1.default.send(msg).then(() => {
                console.log('Email sent');
            })
                .catch((error) => {
                console.error(error);
            });
        });
    }
}
exports.EmailsModule = EmailsModule;
//# sourceMappingURL=Emails.module.js.map