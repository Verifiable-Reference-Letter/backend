import express from "express";
import { LetterModule } from "../modules/Letter.module";
import { LetterDetails } from "../modules/LetterDetails.model";

const router = express.Router();

const letterModule: LetterModule = new LetterModule();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.get('/:publicAddress/received', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByRecipientAddress(req.params.publicAddress);
    res.json(letterModels);
});

router.get('/:publicAddress/written', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByWriterAddress(req.params.publicAddress);
    res.json(letterModels);
});

router.get('/:publicAddress/requested', async (req, res, next) => {
    const letterModels: LetterDetails[] = await letterModule.selectAllSentLetterDetailsByRequestorAddress(req.params.publicAddress);
    res.json(letterModels);
});



export { router };