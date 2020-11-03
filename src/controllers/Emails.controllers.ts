import express from 'Express';
import { EmailsModule } from '../modules/Emails.module';

const router = express.Router();

const emailsModule: EmailsModule = new EmailsModule();

router.get('/sendEmail', async (req, res, next) => {
    console.log('sending email');
    // console.log({ key: process.env.SENDGRID_API_KEY });
    await emailsModule.sendEmailToWriter('0xc315345cab7088e46304e02c097f0a922893302c', '0xc315345cab7088e46304e02c097f0a922893302c');
    res.send("hello");
});

export { router };