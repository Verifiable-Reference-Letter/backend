import SendGrid from "@sendgrid/mail";

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey("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"
            );
    }
//"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"
    public sendMail() {

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

        return SendGrid.send(msg).then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          });
    }
}