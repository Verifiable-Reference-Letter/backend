import express from "express";
import { LetterModule } from "../modules/Letter.module";
import { LetterHistory } from "../database/letter_history/LetterHistory.model";
import { Letter } from "../database/letters/Letter.dbmodel";
const router = express.Router();

const letterModule: LetterModule = new LetterModule();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.post('/received', async (req, res, next) => {
    // const letterModels: Letter[] = await letterModule.selectAllSentLetterDetailsByRecipientAddress(req.params.publicAddress);
    // res.json(letterModels);
});

router.post('/written', async (req, res, next) => {
    // const letterModels: Letter[] = await letterModule.selectAllSentLetterDetailsByWriterAddress(req.params.publicAddress);
    // res.json(letterModels);
});

router.post('/requested', async (req, res, next) => {
    // const letterModels: LetterHistory[] = await letterModule.selectAllSentLetterDetailsByRequestorAddress(req.params.publicAddress);
    // res.json(letterModels);
});

router.post('/:letterId/history', async (req, res, next) => {
    console.log(req.body['auth']);
    console.log("get letter history");
    const letterHistoryModels: LetterHistory[] = await letterModule.selectAllLetterHistoryByLetterId(req.params.letterId);
    console.log(letterHistoryModels);
    res.json(letterHistoryModels);
})

export { router };