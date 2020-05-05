import express from "express";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";

const router = express.Router();

const sentLettersDbService: SentLetterDbService = new SentLetterDbService();

router.get('/:userId', async (req, res, next) => {
    const sentLetterModel: SentLetter = await sentLettersDbService.selectOneRowById(req.params.userId);
    const jsonModel: string = JSON.stringify(sentLetterModel);
    res.send(jsonModel);
});

export { router };