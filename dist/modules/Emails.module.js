"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendGrid = __importStar(require("sendgrid"));
class EmailsModule {
    constructor() {
        this.sgMail = SendGrid.constructor('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');
    }
    sendMail() {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        //this.sgMail.setApiKey('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');
        const msg = {
            to: 'stevenshi1999@gmail.com',
            from: 'stevenshi1999@gmail.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        this.sgMail.send(msg);
    }
}
exports.EmailsModule = EmailsModule;
//# sourceMappingURL=Emails.module.js.map