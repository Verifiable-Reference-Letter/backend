import express from 'Express';
import { EmailsModule } from '../modules/Emails.module';

const router = express.Router();

const emailsModule: EmailsModule = new EmailsModule();

router.get('/sendEmail', async (req, res, next) => {
    console.log('sending email');
    // console.log({ key: process.env.SENDGRID_API_KEY });
    //await emailsModule.sendMail();
    res.send("hello");
});

export { router };