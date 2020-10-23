import express from "express";
import { v4 as uuid } from "uuid";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { Letter } from "../database/letters/Letter.dbmodel";
import { LetterContents } from "../database/letter_contents/LetterContents.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { LetterHistoryDbService } from "../database/letter_history/LetterHistory.dbservice";
import { UserKey } from "../database/users/UserKey.dbmodel";
import { UserKeyDbService } from "../database/users/UserKey.dbservice";
import { UserRole } from "../database/users/UserRole";
import { LetterDbService } from "../database/letters/Letter.dbservice";
import { AuthModule } from "../modules/Auth.module";
const router = express.Router();

const letterDbService: LetterDbService = new LetterDbService();
const letterHistoryDbService: LetterHistoryDbService = new LetterHistoryDbService();
const userKeyDbService: UserKeyDbService = new UserKeyDbService();

// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality

router.use(AuthModule.verifyUser);

router.post("/requested", async (req, res, next) => {
  // TODO: check JWT
  // console.log(req.body["auth"]);
  // console.log("get letters for requestor");
  const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
    res.locals.jwtPayload.publicAddress,
    UserRole.Requestor
  );
  // console.log(letterModels);

  // console.log("get num recipients for each letter");
  let numRecipients: Number[] = [];
  // let numUnsentRecipients: Number[] = [];
  for (let i = 0; i < letterModels.length; i++) {
    const l = letterModels[i];
    const num: Number = await letterHistoryDbService.countRecipientsByLetterId(
      l.letterId
    );
    // const numUnsent: Number = await letterHistoryDbService.countUnsentRecipientsByLetterId(
    //   l.letterId
    // );
    numRecipients.push(num);
    // numUnsentRecipients.push(numUnsent);
  }

  if (letterModels.length !== 0) {
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {
        letters: letterModels,
        numRecipients: numRecipients,
        // numUnsentRecipients: numUnsentRecipients,
      },
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {},
    });
  }
});

router.post("/written", async (req, res, next) => {
  // console.log("get letters for writer");
  const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
    res.locals.jwtPayload.publicAddress,
    UserRole.Writer
  );
  // console.log(letterModels);

  // console.log("get num recipients for each letter");
  let numRecipients: Number[] = [];
  let numUnsentRecipients: Number[] = [];
  for (let i = 0; i < letterModels.length; i++) {
    const l = letterModels[i];
    const num: Number = await letterHistoryDbService.countRecipientsByLetterId(
      l.letterId
    );
    const numUnsent: Number = await letterHistoryDbService.countUnsentRecipientsByLetterId(
      l.letterId
    );
    numRecipients.push(num);
    numUnsentRecipients.push(numUnsent);
  }

  if (letterModels.length !== 0) {
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {
        letters: letterModels,
        numRecipients: numRecipients,
        numUnsentRecipients: numUnsentRecipients,
      },
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {},
    });
  }
});

router.post("/received", async (req, res, next) => {
  // console.log("get letter history for recipient");
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllLetterHistoryByLetterRecipient(
    res.locals.jwtPayload.publicAddress
  );
  // console.log(letterHistoryModels);

  if (letterHistoryModels.length !== 0) {
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: letterHistoryModels,
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {},
    });
  }
});

router.post("/:letterId/history", async (req, res, next) => {
  // console.log(req.params.letterId);
  // console.log("get letter history for given letter_id");
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllSentLetterHistoryByLetterId(
    req.params.letterId
  );
  // console.log(letterHistoryModels);

  if (letterHistoryModels.length !== 0) {
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: letterHistoryModels,
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: letterHistoryModels,
    });
  }
});

router.post("/:letterId/unsent", async (req, res, next) => {
  // console.log(req.params.letterId);
  // console.log("get unsent letter history for given letter_id");
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllUnsentLetterHistoryByLetterId(
    req.params.letterId
  );
  // console.log(letterHistoryModels);
  res.json({
    auth: {
      jwtToken: res.locals.newJwtToken,
    },
    data: letterHistoryModels,
  });
});

router.post("/:letterId/unsentRecipients", async (req, res, next) => {
  // TODO: check JWT
  // console.log(req.body["auth"]);
  // console.log(req.params.letterId);
  // console.log("get unsent recipients for given letter_id");
  const userModels: User[] = await letterHistoryDbService.selectAllUnsentRecipientsByLetterId(
    req.params.letterId
  );
  // console.log(userModels);
  res.json({
    auth: {
      jwtToken: res.locals.newJwtToken,
    },
    data: userModels,
  });
});

router.post("/:letterId/updateRecipients", async (req, res, next) => {
  // console.log(req.params.letterId);
  // console.log("get unsent recipients for given letter_id");
  const success: boolean = await letterHistoryDbService.updateRecipientsByLetterId(
    req.params.letterId,
    req.body["data"]
  );

  if (success) {
    const userModels: User[] = await letterHistoryDbService.selectAllUnsentRecipientsByLetterId(
      req.params.letterId
    );
    // console.log(userModels);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: userModels,
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {},
    });
  }
});

router.post("/create", async (req, res, next) => {
  // console.log("creating new letter based on letter details");
  const data = req.body["data"];
  // console.log(data);

  // const letterId = Math.random().toString(36);
  const currentDate = Date();
  // // console.log(currentDate);
  // // console.log(new Date(currentDate));
  // const letterId = (currentDate + Math.random()).substring(0, 36);
  const letterId = uuid();
  // console.log(letterId);
  const insertLetterSuccess: boolean = await letterDbService.insertLetterByAddressAndLetterDetails(
    letterId,
    res.locals.jwtPayload.publicAddress,
    data.letterWriter,
    currentDate
  );
  // console.log("insertLetterSuccess", insertLetterSuccess);
  if (insertLetterSuccess) {
    const insertSentLetterSuccess: boolean = await letterHistoryDbService.insertRecipientsByLetterId(
      letterId,
      data.selectedRecipients
    );
    // console.log("insertSentLetterSuccess", insertSentLetterSuccess);
    if (insertSentLetterSuccess) {
      const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
        res.locals.jwtPayload.publicAddress,
        UserRole.Requestor
      );
      let numRecipients: Number[] = [];
      // let numUnsentRecipients: Number[] = [];
      for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num: Number = await letterHistoryDbService.countRecipientsByLetterId(
          l.letterId
        );
        // const numUnsent: Number = await letterHistoryDbService.countUnsentRecipientsByLetterId(
        //   l.letterId
        // );
        numRecipients.push(num);
        // numUnsentRecipients.push(numUnsent);
      }

      res.json({
        auth: {
          jwtToken: res.locals.newJwtToken,
        },
        data: {
          letters: letterModels,
          numRecipients: numRecipients,
          // numUnsentRecipients: numUnsentRecipients,
        },
      });
    } else {
      res.status(400);
      res.json({
        auth: {
          jwtToken: res.locals.newJwtToken,
        },
        data: {},
      });
    }
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: {},
    });
  }
});

router.post("/:letterId/contents/writer", async (req, res, next) => {
  // TODO: check JWT

  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("get letter contents for given letterId");
  // TODO: make sure below function checks that letterId is valid id for this user to update
  const letterContents: LetterContents[] = await letterDbService.selectLetterContentsByLetterIdAndWriterId(
    req.params.letterId,
    req.body["auth"].publicAddress
  );
  console.log(letterContents.length);
  if (letterContents && letterContents.length > 0) {
    console.log(letterContents[0].content?.length);
    res.json({ data: letterContents[0].content });
  } else {
    res.status(400);
    res.json({ data: {} });
  }
});

router.post("/:letterId/contents/recipient", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("get letter contents for given letterId");
  const letterContents: LetterContents[] = await letterHistoryDbService.selectLetterContentsByLetterIdAndRecipientId(
    req.params.letterId,
    req.body["auth"].publicAddress
  );
  console.log(letterContents.length);
  if (letterContents && letterContents.length > 0) {
    console.log(letterContents[0].content?.length);
    res.json({ data: letterContents[0].content });
  } else {
    res.status(400);
    res.json({ data: {} });
  }
});

router.post("/:letterId/contents/update", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("update letter contents for given letterId");
  const currentDate = Date();
  const numRecipients: Number = await letterHistoryDbService.countRecipientsByLetterId(
    req.params.letterId
  );

  if (numRecipients === 0) {
    const success: boolean = await letterDbService.updateLetterContentsByLetterIdAndWriterId(
      req.body["data"],
      currentDate,
      req.params.letterId,
      req.body["auth"].publicAddress
    );
    console.log(success);
    if (!success) {
      res.status(400);
      res.json({ data: {} });
    } else {
      // res.json({ data: {} });
      const letters: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
        req.body["auth"].publicAddress,
        UserRole.Writer
      );
      if (letters) {
        res.json({ data: letters });
      } else {
        res.status(400);
        res.json({ data: {} });
      }
    }
  } else {
    console.log(
      "invalid action: not allowed to update letter content of letter already sent to >= 1 recipient"
    );
    res.status(400);
    res.json({ data: {} });
  }
});

router.post("/:letterId/unsentRecipientKeys", async (req, res, next) => {
  const userKeyModels: UserKey[] = await letterHistoryDbService.selectAllUnsentRecipientKeysByLetterId(
    req.params.letterId
  );
  console.log(userKeyModels.length);
  if (userKeyModels.length === 0) {
    res.status(400);
    res.json({ data: {} });
  } else {
    res.json({ data: { userKeys: userKeyModels } });
  }
  
  // const userModels: User[] = await letterHistoryDbService.selectAllUnsentRecipientsByLetterId(
  //   req.params.letterId
  // );
  // console.log(userModels.length);

  // let userKeys: UserKey[] = [];
  // for (let i = 0; i < userModels.length; i++) {
  //   const publicAddress = userModels[i].publicAddress;
  //   const userKey: UserKey = await userKeyDbService.selectUserKey(
  //     publicAddress
  //   );
  //   if (userKey) {
  //     userKeys.push(userKey);
  //   } else {
  //     console.log("userKey not found for", publicAddress);
  //   }
  // }
  // console.log(userKeys.length);
  // if (userKeys.length === 0) {
  //   res.status(400);
  //   res.json({ data: {} });
  // } else {
  //   res.json({ data: { userKeys: userKeys } });
  // }
});

export { router };
