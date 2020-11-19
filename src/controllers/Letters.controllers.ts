import express from "express";
import { v4 as uuid } from "uuid";
import { LetterHistory } from "../database/letter_history/LetterHistory.dbmodel";
import { Letter } from "../database/letters/Letter.dbmodel";
import { LetterContents } from "../database/letter_contents/LetterContents.dbmodel";
import { User } from "../database/users/User.dbmodel";
import { LetterHistoryDbService } from "../database/letter_history/LetterHistory.dbservice";
import { UserKey } from "../database/users/UserKey.dbmodel";
import { UserKeyDbService } from "../database/users/UserKey.dbservice";
import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
import { UserRole } from "../database/users/UserRole";
import { LetterDbService } from "../database/letters/Letter.dbservice";
import { AuthModule } from "../modules/Auth.module";
import { LetterContentsDbService } from "../database/letter_contents/LetterContents.dbservice";
import { LetterRecipientContentsDbService } from "../database/letter_recipient_contents/LetterRecipientContents.dbservice";
import { UserDbService } from "../database/users/User.dbservice";
import { LetterRecipientContents } from "../database/letter_recipient_contents/LetterRecipientContents.dbmodel";
import { EmailsModule } from "../modules/Emails.module";
import { SentLetterDbService } from "../database/sent_letters/SentLetter.dbservice";
const router = express.Router();

const letterDbService: LetterDbService = new LetterDbService();
const letterHistoryDbService: LetterHistoryDbService = new LetterHistoryDbService();
const letterContentsDbService: LetterContentsDbService = new LetterContentsDbService();
const letterRecipientContentsDbService: LetterRecipientContentsDbService = new LetterRecipientContentsDbService();
const userKeyDbService: UserKeyDbService = new UserKeyDbService();
const userDbService: UserDbService = new UserDbService();
const sentLetterDbService: SentLetterDbService = new SentLetterDbService();
const authModule: AuthModule = new AuthModule();
const userAuthDbService: UserAuthDbService = new UserAuthDbService();
const emailModule: EmailsModule = new EmailsModule();
// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.use(AuthModule.verifyUser);

/**
 * get all letters for requestor along with num recipients for each letter
 */
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
    const num: Number = await letterHistoryDbService.countSentRecipientsByLetterId(
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

/**
 * get all letters for writer along with num sent and unsent recipients for each letter
 */
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
    const num: Number = await letterHistoryDbService.countSentRecipientsByLetterId(
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

/**
 * get all letters for recipient
 */
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

/**
 * get all requestors who have sent atleast one letter to the indicated recipient
 */
router.post("/receivedRequestors", async (req, res, next) => {
  console.log(res.locals.jwtPayload.publicAddress);
  const requestors: User[] = await userDbService.selectAllLetterRequestorByLetterRecipient(
    res.locals.jwtPayload.publicAddress
  );

  if (requestors.length !== 0) {
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: requestors,
    });
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: [],
    });
  }
});

/**
 * get all letter history based on recipient's public address and requestor's public address since we group by requestor
 */
router.post("/received/:publicAddress", async (req, res, next) => {
  const letterRequestor = req.params.publicAddress;
  const letterHistoryModels: LetterHistory[] = await letterHistoryDbService.selectAllLetterHistoryByLetterRecipientAndLetterRequestor(
    res.locals.jwtPayload.publicAddress,
    letterRequestor
  );
  console.log(letterHistoryModels);

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
      data: [],
    });
  }
});

/**
 * get all letter history for a given letter id (for requestor and writer pages)
 */
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
      data: [],
    });
  }
});

/**
 * get all unsent letter history for a given letter id
 */
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

/**
 * get all unsent letter recipients for a given letter id
 */
router.post("/:letterId/unsentRecipients", async (req, res, next) => {
  // TODO: check JWT
  // console.log(req.body["auth"]);
  // console.log(req.params.letterId);
  // console.log("get unsent recipients for given letter_id");
  const userModels: User[] = await userDbService.selectAllUnsentRecipientsByLetterId(
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

/**
 * get all sent letter recipients for a given letter id
 */
router.post("/:letterId/sentRecipients", async (req, res, next) => {
  // TODO: check JWT
  // console.log(req.body["auth"]);
  // console.log(req.params.letterId);
  // console.log("get unsent recipients for given letter_id");
  const userModels: User[] = await userDbService.selectAllSentRecipientsByLetterId(
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

/**
 * update the recipients for a given letter id with an updated recipients list
 */
router.post("/:letterId/updateRecipients", async (req, res, next) => {
  // console.log(req.params.letterId);
  // console.log("get unsent recipients for given letter_id");

  const recipientsList = req.body["data"];

  // backend should also check that updated recipients list does not include recipients already sent to
  sentLetterDbService.selectAllSentLettersByLetterIdAndRecipient(
    req.params.letterId,
    recipientsList[0]
  );

  const success: boolean = await letterHistoryDbService.updateRecipientsByLetterId(
    req.params.letterId,
    recipientsList
  );

  if (success) {
    const userModels: User[] = await userDbService.selectAllUnsentRecipientsByLetterId(
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
      data: [],
    });
  }
});

/**
 * make a new request (for a letter) with indicated writer and recipients list (for requestor's page)
 */
router.post("/create", async (req, res, next) => {
  // console.log("creating new letter based on letter details");
  const data = req.body["data"];
  console.log(data.customMessage);
  // console.log(data);

  // const letterId = Math.random().toString(36);
  const currentDate = Date();
  // // console.log(currentDate);
  // // console.log(new Date(currentDate));
  // const letterId = (currentDate + Math.random()).substring(0, 36);
  const letterId = uuid();
  console.log(letterId);
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
      console.log("about to send email after letter creation");
      console.log(data.customMessage);
      await emailModule.sendEmailToWriter(
        res.locals.jwtPayload.publicAddress, 
        data.letterWriter,
        data.customMessage 
      );
      console.log("should have completed email send");

      const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
        res.locals.jwtPayload.publicAddress,
        UserRole.Requestor
      );
      let numRecipients: Number[] = [];
      // let numUnsentRecipients: Number[] = [];
      for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num: Number = await letterHistoryDbService.countSentRecipientsByLetterId(
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

/**
 * retrieve the letter contents by letter id and writer id (for writer's page view functionality)
 */
router.post("/:letterId/contents/writer", async (req, res, next) => {
  // TODO: check JWT

  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("get letter contents for given letterId");
  // TODO: make sure below function checks that letterId is valid id for this user to update
  const letterContents: LetterContents[] = await letterContentsDbService.selectLetterContentsByLetterIdAndWriterId(
    req.params.letterId,
    req.body["auth"].publicAddress
  );
  console.log(letterContents.length);
  if (letterContents && letterContents.length > 0) {
    console.log(letterContents[0].contents?.length);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: letterContents[0].contents,
    });
  } else {
    res.status(400);
    res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: {} });
  }
});

// /**
//  * retrieve the letter contents by letter id and recipient id (for recipient's page view functionality)
//  */
// router.post("/:letterId/contents/recipient", async (req, res, next) => {
//   // TODO: check JWT
//   console.log(req.body["auth"]);
//   console.log(req.params.letterId);
//   console.log("get letter contents for given letterId");
//   const letterContents: LetterContents[] = await letterContentsDbService.selectLetterContentsByLetterIdAndRecipientId(
//     req.params.letterId,
//     req.body["auth"].publicAddress
//   );

//   if (letterContents && letterContents.length > 0) {
//     console.log(letterContents[0].contents?.length);
//     res.json({ data: letterContents[0].contents });
//   } else {
//     res.status(400);
//     res.json({ data: {} });
//   }
// });

/**
 * update the letter contents for given letter id and writer id after checking if not sent to any recipients
 */
router.post("/:letterId/contents/update", async (req, res, next) => {
  // TODO: check JWT
  console.log(req.body["auth"]);
  console.log(req.params.letterId);
  console.log("update letter contents for given letterId");

  const data: { encryptedFile: string; customMessage: string } =
    req.body["data"];
  const currentDate = Date();
  const numRecipients: Number = await letterHistoryDbService.countSentRecipientsByLetterId(
    req.params.letterId
  );
  console.log(data.customMessage);

  // check if not sent to any recipients (not allowing changing of letter contents after atleast 1 sent)
  if (numRecipients === 0) {
    const success: boolean = await letterContentsDbService.updateLetterContentsByLetterIdAndWriterId(
      data.encryptedFile,
      currentDate,
      req.params.letterId,
      res.locals.jwtPayload.publicAddress
    );
    console.log(success);
    if (!success) {
      res.status(400);
      res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: [] });
    } else {
      // res.json({ data: {} });
      const letters: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
        res.locals.jwtPayload.publicAddress,
        UserRole.Writer
      );
      if (letters) {
        const letter = letters.find(elem => elem.letterId == req.params.letterId);
        await emailModule.sendEmailToRequestor(
          letter.letterRequestor.publicAddress, 
          res.locals.jwtPayload.publicAddress,
          req.body["data"].customMessage
          );
          res.json({
            auth: {
              jwtToken: res.locals.newJwtToken,
            },
            data: letters,
          });
      } else {
        res.status(400);
        res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: [] });
      }
    }
  } else {
    console.log(
      "invalid action: not allowed to update letter content of letter already sent to >= 1 recipient"
    );
    res.status(400);
    res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: [] });
  }
});

/**
 * retrieve all the unsent recipients with their public keys (userkey) for the indicated letter id
 */
router.post("/:letterId/unsentRecipientKeys", async (req, res, next) => {
  const userKeyModels: UserKey[] = await userKeyDbService.selectAllUnsentRecipientKeysByLetterId(
    req.params.letterId
  );
  console.log(userKeyModels.length);
  if (userKeyModels.length === 0) {
    res.status(400);
    res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: {} });
  } else {
    res.json({
      auth: { jwtToken: res.locals.newJwtToken },
      data: { userKeys: userKeyModels },
    });
  }
});

/**
 * retrieve the encrypted contents, hash, and signature for a given letter_id and recipient id
 */
router.post("/:letterId/recipientContents", async (req, res, next) => {
  const letterRecipientContents: LetterRecipientContents[] = await letterRecipientContentsDbService.selectLetterContentsByLetterIdAndRecipientId(
    req.params.letterId,
    res.locals.jwtPayload.publicAddress
  );

  if (
    letterRecipientContents.length === 0 ||
    letterRecipientContents[0].letterContents === null ||
    letterRecipientContents[0].letterSignature === null
  ) {
    res.status(400);
    res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: {} });
  } else {
    res.json({
      data: { auth: { jwtToken: res.locals.newJwtToken }, letterRecipientContents: letterRecipientContents[0] },
    });
  }
});

/**
 * update the encrypted contents, hash, and recipient for a given letter_id and recipient_id
 */
router.post("/:letterId/recipientContents/update", async (req, res, next) => {
  console.log("/:letterId/recipientContents/update");
  const data: {
    letterContents: string;
    // letterHash: string,
    letterSignature: string;
    letterRecipient: string;
  } = req.body["data"];

  // this 'encrypted:' padding is necessary since without it the verification would not work properly (with the given message)
  const verifySuccess: boolean = await authModule.verifySignature(
    "encrypted:" + data.letterContents,
    data.letterSignature,
    res.locals.jwtPayload.publicAddress
  );

  if (verifySuccess) {
    const currentDate = Date();
    const success: boolean = await letterRecipientContentsDbService.updateLetterContentsByLetterIdAndRecipientId(
      data.letterContents,
      // data.letterHash,
      data.letterSignature,
      currentDate,
      req.params.letterId,
      data.letterRecipient
    );

    if (!success) {
      res.status(400);
      res.json({ auth: { jwtToken: res.locals.newJwtToken }, data: { error: "Failed to update recipient contents for letter id sent" } });
    } else {
      const letterModels: Letter[] = await letterDbService.selectAllLettersByAddressAndRole(
        res.locals.jwtPayload.publicAddress,
        UserRole.Writer
      );

      const updatedLetter: Letter = letterModels.filter(letter => letter.letterId == req.params.letterId)[0];
      console.log(updatedLetter.letterId);
      await emailModule.sendEmailToRecipient(
        updatedLetter,
        data.letterRecipient
      )

      let numRecipients: Number[] = [];
      let numUnsentRecipients: Number[] = [];
      for (let i = 0; i < letterModels.length; i++) {
        const l = letterModels[i];
        const num: Number = await letterHistoryDbService.countSentRecipientsByLetterId(
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
          data: { error: "Failed to select writer letters under writer role" },
        });
      }
    }
  } else {
    res.status(400);
    res.json({
      auth: {
        jwtToken: res.locals.newJwtToken,
      },
      data: { error: "Failed to verify signature" },
    });
  }
});

export { router };
