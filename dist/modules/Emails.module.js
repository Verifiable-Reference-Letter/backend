"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
class EmailsModule {
    constructor() {
        mail_1.default.setApiKey("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");
    }
    //"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"
    sendMail() {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        //this.sgMail.setApiKey('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');
        const msg = {
            to: 'stevenshi1999@gmail.com',
            from: 'teamgas2020@gmail.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        return mail_1.default.send(msg).then(() => {
            console.log('Email sent');
        })
            .catch((error) => {
            console.error(error);
        });
    }
}
exports.EmailsModule = EmailsModule;
//# sourceMappingURL=Emails.module.js.map