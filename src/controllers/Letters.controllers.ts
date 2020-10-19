import express from "express";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { Letter } from "../database/letters/Letter.dbmodel";
import { LetterHistoryDbService } from "../database/letter_history/LetterHistory.dbservice";
import { UserRole } from "../database/users/UserRole";
import { LetterDbService } from "../database/letters/Letter.dbservice";
const router = express.Router();

const letterDbService: LetterDbService = new LetterDbService();
const letterHistoryDbService: LetterHistoryDbService = new LetterHistoryDbService();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality

router.post("/requested", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter for requestor");
  const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
    req.body["auth"].publicAddress,
    UserRole.Requestor
  );
  console.log(letterModels);

  console.log("get num recipients for each letter");
  let numRecipients: Number[] = [];
  for (let i = 0; i < letterModels.length; i++) {
    const l = letterModels[i];
    const num = await letterHistoryDbService.countRecipientsByLetterId(l.letterId);
    numRecipients.push(num);
  }
  console.log(numRecipients);

  if (letterModels.length !== 0) {
    res.json({ data: { letters: letterModels, numRecipients: numRecipients }});
  } else {
    res.status(400);
  }
});

router.post("/written", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter for writer");
  const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
    req.body["auth"].publicAddress,
    UserRole.Writer
  );
  console.log(letterModels);

  console.log("get num recipients for each letter");
  let numRecipients: Number[] = [];
  for (let i = 0; i < letterModels.length; i++) {
    const l = letterModels[i];
    const num = await letterHistoryDbService.countRecipientsByLetterId(l.letterId);
    numRecipients.push(num);
  }
  console.log(numRecipients);

  if (letterModels.length !== 0) {
    res.json({ data: { letters: letterModels, numRecipients: numRecipients}});
  } else {
    res.status(400);
  }
});

router.post("/received", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log("get letter history for recipient");
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllLetterHistoryByLetterRecipient(
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
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllSentLetterHistoryByLetterId(
    req.params.letterId
  );
  console.log(letterHistoryModels);

  if (letterHistoryModels.length !== 0) {
    res.json({ data: letterHistoryModels });
  } else {
    res.status(400);
  }
});

router.post("/:letterId/unsent", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("get letter history for given letter_id");
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllUnsentLetterHistoryByLetterId(
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
