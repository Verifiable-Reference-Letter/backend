import express from "express";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
import { SentLetter } from "../database/sent_letters/SentLetter.dbmodel";
import { LetterDbService } from "../database/letters/Letter.dbservice";
import { Letter } from "../database/letters/Letter.dbmodel";

const router = express.Router();

const sentLettersDbService: SentLetterDbService = new SentLetterDbService();
const letterDbService: LetterDbService = new LetterDbService();

router.get('/:userId', async (req, res, next) => {
    const sentLetterModels: Letter[] = await letterDbService.selectAllLettersByRecipientId(req.params.userId);
    res.send(sentLetterModels);
});

export { router };