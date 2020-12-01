import SendGrid from "@sendgrid/mail";
import { request } from "http";
import { UserEmail } from "../database/users/UserEmail.dbmodel";
import { UserEmailDbService } from "../database/users/UserEmail.dbservice";
import * as jwt from "jsonwebtoken";
import { Letter } from "../database/letters/Letter.dbmodel";

const userEmailDbService = new UserEmailDbService();
const jwtKey = "my private key";

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY
            );
    }

    async sendEmailToWriter(
      requestorAddress: string,
      writerAddress: string,
      customMessage: string
    ): Promise<void> {
      const requestor: UserEmail = await userEmailDbService.getUserEmail(requestorAddress);
      const writer: UserEmail = await userEmailDbService.getUserEmail(writerAddress);
      console.log(requestor);
      console.log(writer);
      if (requestor != null && writer != null) {
        console.log("about to send writer email");
        let message: string = `${requestor.name} has requested a letter from you.\n`;
        let finalMessage: string;
        if (customMessage) {
          finalMessage = message.concat(customMessage);
        }
        console.log(message);
        await this.sendEmail(
          writer.email,
          'verifiablereferenceletter@gmail.com',
          'Letter Request',
          finalMessage,
        );
      }
    }

    async sendEmailToRequestor(
      requestorAddress: string, 
      writerAddress: string,
      customMessage: string
      ): Promise<void> {
      const requestor: UserEmail = await userEmailDbService.getUserEmail(requestorAddress);
      const writer: UserEmail = await userEmailDbService.getUserEmail(writerAddress);
      if (requestor != null && writer != null) {
        let message: string = `${writer.name} has uploaded an updated letter for you. You can still select recipients for secure sending on https://verifiable-reference-letter.herokuapp.com/ now!\n`
        let finalMessage: string;
        if (customMessage) {
          finalMessage = message.concat(customMessage);
        }
        console.log(message);
        await this.sendEmail(
          requestor.email,
          'verifiablereferenceletter@gmail.com',
          'Your requested letter has been uploaded',
          finalMessage
        );
      }
    }

    async sendEmailToRecipient(
      letterSent: Letter,
      recipientAddress: string
    ): Promise<void> {
      const requestor: UserEmail = await userEmailDbService.getUserEmail(letterSent.letterRequestor.publicAddress);
      const writer: UserEmail = await userEmailDbService.getUserEmail(letterSent.letterWriter.publicAddress);
      const recipient: UserEmail = await userEmailDbService.getUserEmail(recipientAddress);

      if (requestor != null && writer != null && recipient != null) {
        await this.sendEmail(
          recipient.email,
          'verifiablereferenceletter@gmail.com',
          'You have been sent a letter',
          `${writer.name} has sent you a letter on behalf of ${requestor.name} on https://verifiable-reference-letter.herokuapp.com/`
        )
      }
    }

    async sendVerificationEmail(publicAddress: string): Promise<boolean> {
      const user: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(publicAddress);

      const jwtToken = jwt.sign({ publicAddress }, jwtKey, {
        algorithm: "HS256",
        expiresIn: "1h",
      });
      return await this.sendEmail(
        user.email,
        'verifiablereferenceletter@gmail.com',
        'Please verify your email',
        `Verify your email on the letter sending dApp: https://verifiable-reference-letter.herokuapp.com/auth/verifyEmail/${jwtToken}`
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
    }

    async sendEmail(
      toEmail: string, 
      fromEmail: string, 
      subject: string, 
      html: string
      ): Promise<boolean> {
        const msg = {
        to: toEmail,
        from: fromEmail,
        subject: subject,
        html: html,
        };

        return await SendGrid.send(msg).then(() => {
            console.log('Email sent')
            return true;
          })
          .catch((error) => {
            console.error(error)
            return false;
          });
    }
}
