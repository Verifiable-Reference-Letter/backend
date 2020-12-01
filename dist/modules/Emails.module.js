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
    sendEmailToWriter(requestorAddress, writerAddress, customMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestor = yield userEmailDbService.getUserEmail(requestorAddress);
            const writer = yield userEmailDbService.getUserEmail(writerAddress);
            console.log(requestor);
            console.log(writer);
            if (requestor != null && writer != null) {
                console.log("about to send writer email");
                let message = `${requestor.name} has requested a letter from you.\n`;
                if (customMessage) {
                    message.concat(customMessage);
                }
                console.log(message);
                yield this.sendEmail(writer.email, 'verifiablereferenceletter@gmail.com', 'Letter Request', message);
            }
        });
    }
    sendEmailToRequestor(requestorAddress, writerAddress, customMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestor = yield userEmailDbService.getUserEmail(requestorAddress);
            const writer = yield userEmailDbService.getUserEmail(writerAddress);
            if (requestor != null && writer != null) {
                let message = `${writer.name} has uploaded an updated letter for you. You can still select recipients for secure sending on https://verifiable-reference-letter.herokuapp.com/ now!\n`;
                if (customMessage) {
                    message = message.concat(customMessage);
                }
                console.log(message);
                yield this.sendEmail(requestor.email, 'verifiablereferenceletter@gmail.com', 'Your requested letter has been uploaded', message);
            }
        });
    }
    sendEmailToRecipient(letterSent, recipientAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestor = yield userEmailDbService.getUserEmail(letterSent.letterRequestor.publicAddress);
            const writer = yield userEmailDbService.getUserEmail(letterSent.letterWriter.publicAddress);
            const recipient = yield userEmailDbService.getUserEmail(recipientAddress);
            if (requestor != null && writer != null && recipient != null) {
                yield this.sendEmail(recipient.email, 'verifiablereferenceletter@gmail.com', 'You have been sent a letter', `${writer.name} has sent you a letter on behalf of ${requestor.name} on https://verifiable-reference-letter.herokuapp.com/`);
            }
        });
    }
    sendVerificationEmail(publicAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userEmailDbService.selectOneRowByPrimaryId(publicAddress);
            const jwtToken = jwt.sign({ publicAddress }, jwtKey, {
                algorithm: "HS256",
                expiresIn: "1h",
            });
            return yield this.sendEmail(user.email, 'verifiablereferenceletter@gmail.com', 'Please verify your email', `Verify your email on the letter sending dApp: https://verifiable-reference-letter.herokuapp.com/auth/verifyEmail/${jwtToken}`
            // `
            // Verify your email on the letter sending dApp:
            // <form method="post" action="http://localhost:8080/auth/verifyEmail/${jwtToken}" class="inline">
            //   <input type="hidden" name="extra_submit_param" value="extra_submit_value">
            //   <button type="submit" name="submit_param" value="submit_value" class="link-button">
            //      Click here to verify!
            //   </button>
            // </form>
            // `
            );
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
            return yield mail_1.default.send(msg).then(() => {
                console.log('Email sent');
                return true;
            })
                .catch((error) => {
                console.error(error);
                return false;
            });
        });
    }
}
exports.EmailsModule = EmailsModule;
//# sourceMappingURL=Emails.module.js.map