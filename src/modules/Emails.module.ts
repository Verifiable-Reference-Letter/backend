import SendGrid from "@sendgrid/mail";
import { request } from "http";
import { UserEmail } from "../database/users/UserEmail.dbmodel";
import { UserEmailDbService } from "../database/users/UserEmail.dbservice";
import * as jwt from "jsonwebtoken";

const userEmailDbService = new UserEmailDbService();
const jwtKey = "my private key";

export class EmailsModule {

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY
            );
    }

    async sendEmailToWriter(requestorAddress: string, writerAddress: string) {
      const requestor: UserEmail = await userEmailDbService.getUserEmail(requestorAddress);
      const writer: UserEmail = await userEmailDbService.getUserEmail(writerAddress);
      console.log(requestor);
      console.log(writer);
      if (requestor != null && writer != null) {
        console.log("about to send writer email");
        this.sendEmail(
          writer.email,
          'verifiablereferenceletter@gmail.com',
          'Letter Request',
          `${requestor.name} has requested a letter from you.`
        );
      }
    }

    async sendEmailToRequestor(requestorAddress: string, writerAddress: string) {
      const requestor: UserEmail = await userEmailDbService.getUserEmail(requestorAddress);
      const writer: UserEmail = await userEmailDbService.getUserEmail(writerAddress);
      if (requestor != null && writer != null) {
        this.sendEmail(
          requestor.email,
          'verifiablereferenceletter@gmail.com',
          'Your requested letter has been uploaded',
          `${writer.name} has uploaded updates to your letter. You can start select recipients and send the letter securely and safely on the dApp now!`
        );
      }
    }

    async sendVerificationEmail(publicAddress: string) {
      const user: UserEmail = await userEmailDbService.selectOneRowByPrimaryId(publicAddress);

      const jwtToken = jwt.sign({ publicAddress }, jwtKey, {
        algorithm: "HS256",
        expiresIn: "1h",
      });
      this.sendEmail(
        user.email,
        'verifiablereferenceletter@gmail.com',
        'Please verify your email',
        `Click this link to verify your email on the letter sending dApp: <a href="https://www.verifiable-reference-letter.herokuapp.com/auth/verifyEmail/${jwtToken}">`
      );
    }

    private sendEmail(
      toEmail: string, 
      fromEmail: string, 
      subject: string, 
      html: string
      ) {
        const msg = {
        to: toEmail,
        from: fromEmail,
        subject: subject,
        html: html,
        };

        return SendGrid.send(msg).then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          });
    }
}
