import SendGrid from "@sendgrid/mail";
import { request } from "http";
import { User } from "../database/users/User.dbmodel";
import { UserDbService } from "../database/users/User.dbservice";

const userDbService = new UserDbService();

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY
            );
    }

    async sendEmailToWriter(requestorAddress: string, writerAddress: string) {
      const requestor: User = await userDbService.selectOneRowByPrimaryId(requestorAddress);
      const writer: User = await userDbService.selectOneRowByPrimaryId(writerAddress);

      this.sendEmail(
        requestor.email,
        writer.email,
        'Letter Request',
        `${requestor.name} has requested a letter from you.`
      );
    }

    async sendEmailToRequestor(requestorAddress: string, writerAddress: string) {
      const requestor: User = await userDbService.selectOneRowByPrimaryId(requestorAddress);
      const writer: User = await userDbService.selectOneRowByPrimaryId(writerAddress);

      this.sendEmail(
        requestor.email,
        writer.email,
        'Your requested letter has been uploaded',
        `${writer.name} has uploaded your letter. You can start selecting recipients on the dApp now!`
      );
    }

    async sendEmail(
      toEmail: string, 
      fromEmail: string, 
      subject: string, 
      text: string
      ) {
        const msg = {
        to: toEmail,
        from: fromEmail,
        subject: subject,
        text: text,
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
