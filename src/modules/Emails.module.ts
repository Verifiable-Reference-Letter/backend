import * as SendGrid from "sendgrid";

export class EmailsModule {
    
    private sgMail: any;

    constructor() {
        this.sgMail = SendGrid.constructor(
            process.env.SENDGRID_API_KEY
        );
    }

    sendMail() {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.sgMail.setApiKey('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');
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