import express from 'Express';
import { EmailsModule } from '../modules/Emails.module';

const router = express.Router();

const emailsModule: EmailsModule = new EmailsModule();

router.get('/sendEmail', async (req, res, next) => {
    console.log('sending email');
    await emailsModule.sendMail();
    res.send(EmailsModule)
});

export { router };