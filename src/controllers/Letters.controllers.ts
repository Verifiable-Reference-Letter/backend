import express from "express";
import { LetterModule } from "../modules/Letter.module";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { Letter } from "../database/letters/Letter.dbmodel";
const router = express.Router();

const letterModule: LetterModule = new LetterModule();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality

router.post("/requested", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter for requestor");
  const letterModels: Letter[] = await letterModule.selectAllLettersByRequestorAddress(
    req.body["auth"].publicAddress
  );
  console.log("got letter models");
  console.log(letterModels);
  if (letterModels.length !== 0) {
    res.json({ data: letterModels });
  } else {
    res.status(400);
  }
});

router.post("/written", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter for writer");
  const letterModels: Letter[] = await letterModule.selectAllLettersByWriterAddress(
    req.body["auth"].publicAddress
  );
  console.log("got letter models");
  console.log(letterModels);
  if (letterModels.length !== 0) {
    res.json({ data: letterModels });
  } else {
    res.status(400);
  }
});

router.post("/received", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter history for recipient");
  const letterHistoryModels: LetterHistory[] = await letterModule.selectAllLettersByRecipientAddress(
    req.body["auth"].publicAddress
  );
  console.log(letterHistoryModels);
  if (letterHistoryModels.length !== 0) {
    res.json({ data: letterHistoryModels });
  } else {
    res.status(400);
  }
});

router.post("/:letterId/history", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("get letter history for given letter_id");
  const letterHistoryModels: LetterHistory[] = await letterModule.selectAllLetterHistoryByLetterId(
    req.params.letterId
  );
  console.log(letterHistoryModels);
  if (letterHistoryModels.length !== 0) {
    res.json({ data: letterHistoryModels });
  } else {
    res.status(400);
  }
});

router.post("/:letterId/contents", async (req, res, next) => {
    console.log(req.body["auth"]);
    console.log(req.params.letterId);
    console.log("get letter contents for given letterId");
    // TODO: make sure below function checks that letterId is valid id for this user to update
    //   const success: boolean = await letterModule.getLetterContentsByLetterId(
    //     req.params.letterId
    //   );
    //   console.log(success);
    //   if (!success) res.status(400);
});

router.post("/:letterId/contents/update", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("update letter contents for given letterId");
  // TODO: make sure below function checks that letterId is valid id for this user to update
  //   const success: boolean = await letterModule.updateLetterContentsByLetterId(
  //     req.params.letterId
  //   );
  //   console.log(success);
  //   if (!success) res.status(400);
});

export { router };
