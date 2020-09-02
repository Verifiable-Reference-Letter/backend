import express from "express";
import { LetterModule } from "../modules/Letter.module";
import { LetterDetails } from "../modules/LetterDetails.model";

const router = express.Router();

const letterModule: LetterModule = new LetterModule();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.get('/:userId/received', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByRecipientId(req.params.userId);
    res.json(letterModels);
});

router.get('/:userId/written', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByWriterId(req.params.userId);
    res.json(letterModels);
});

router.get('/:userId/requested', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByRequestorId(req.params.userId);
    res.json(letterModels);
});

export { router };