import SendGrid from "@sendgrid/mail";
import { request } from "http";
import { UserEmail } from "../database/users/UserEmail.dbmodel";
import { UserEmailDbService } from "../database/users/UserEmail.dbservice";

const userEmailDbService = new UserEmailDbService();

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY
            );
    }

    async sendEmailToWriter(requestorAddress: string, writerAddress: string) {
      const requestor: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(requestorAddress);
      const writer: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(writerAddress);

      this.sendEmail(
        requestor.email,
        writer.email,
        'Letter Request',
        `${requestor.name} has requested a letter from you.`
      );
    }

    async sendEmailToRequestor(requestorAddress: string, writerAddress: string) {
      const requestor: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(requestorAddress);
      const writer: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(writerAddress);

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
