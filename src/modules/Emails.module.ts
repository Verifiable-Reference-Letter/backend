import SendGrid from "@sendgrid/mail";

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY
            );
    }
    public sendMail() {
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
