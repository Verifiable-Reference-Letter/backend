import express from "express";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";

const router = express.Router();

const sentLettersDbService: SentLetterDbService = new SentLetterDbService();

router.get('/:userId', async (req, res, next) => {
    const sentLetterModels: SentLetter[] = await sentLettersDbService.selectAllSentLettersByRecipientId(req.params.userId);
    res.send(sentLetterModels);
});

export { router };