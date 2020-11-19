import express, { response } from "express";
import { AuthModule } from "../modules/Auth.module";
// import { UserDbService } from "../database/users/User.dbservice";
import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
import { User } from "../database/users/User.dbmodel";
import { UserAuth } from "../database/users/UserAuth.dbmodel";

import * as jwt from "jsonwebtoken";
import { UserEmailDbService } from "../database/users/UserEmail.dbservice";
import { EmailsModule } from "../modules/Emails.module";
import { UserEmail } from "../database/users/UserEmail.dbmodel";

const router = express.Router();

const authModule: AuthModule = new AuthModule();
// const usersDbService: UserDbService = new UserDbService();
const userAuthDbService: UserAuthDbService = new UserAuthDbService();
const userEmailDbService: UserEmailDbService = new UserEmailDbService();

// TODO: change this to be hidden
const jwtKey: string = "my private key";

const emailsModule: EmailsModule = new EmailsModule();

router.get("/sendEmail", async (req, res, next) => {
  console.log("sending email");
  // console.log({ key: process.env.SENDGRID_API_KEY });
  await emailsModule.sendEmailToWriter(
    "0xc315345cab7088e46304e02c097f0a922893302c",
    "0xc315345cab7088e46304e02c097f0a922893302c",
    "johnny"
  );
  res.send("hello");
});

router.post("/", async (req, res, next) => {
  console.log("Authenticating");
  const publicAddress: string = req.body.publicAddress;
  let userModel = await userAuthDbService.selectOneRowByPrimaryId(
    publicAddress
  );
  const userEmail: UserEmail = await userEmailDbService.getUserEmail(
    publicAddress
  );
  if (userEmail.isEmailVerified == false) {
    console.log("email not verified");
    res.status(401);
    res.json({
      data: { error: "Account does not have their email verified" },
    });
  } else {
    const verifySuccess: boolean = await authModule.verifySignature(
      userModel.nonce,
      req.body.signature,
      publicAddress
    );

    let jwtToken;
    if (verifySuccess === true) {
      console.log("signature verified success");
      jwtToken = jwt.sign({ publicAddress }, jwtKey, {
        algorithm: "HS256",
        expiresIn: "1h",
      });
      console.log(jwtToken);
      res.send({
        data: { jwtToken: jwtToken, publicAddress: publicAddress },
      });
    } else {
      console.log(verifySuccess, "something went wrong with verification");
      res.status(400);
      res.json({
        data: { error: "Failed to verify signature" },
      });
    }
  }
});

router.post("/users/create", async (req, res, next) => {
  console.log("Creating user");
  console.log(req.body["publicAddress"]);
  console.log(req.body["name"]);
  console.log(req.body["email"]);
  console.log(req.body["publicKey"]);
  // check if the user is already created
  let userModel: User = await userAuthDbService.selectOneRowByPrimaryId(
    req.body.publicAddress
  );
  if (userModel == null) {
    // if not, create the user and send back to frontend
    console.log("user doesn't exist, creating user");
    userModel = await userAuthDbService.createUser(
      req.body.publicAddress,
      req.body.name,
      req.body.email,
      req.body.publicKey
    );
    console.log(userModel);
    let success = await emailsModule.sendVerificationEmail(
      req.body.publicAddress
    );
    console.log("success", success);

    if (success) {
      res.send([userModel]);
    } else {
      res.status(501);
      res.send([]);
    }
  } else {
    console.log("user exists, no need to create user"); // ADD SOME INDICATION IN RESPONSE
    res.send([]);
  }
});

router.get("/users/:publicAddress", async (req, res, next) => {
  console.log("Got into users GET for single address");
  const userModel: UserAuth = await userAuthDbService.getUserAuth(
    req.params.publicAddress
  );
  res.send([userModel]);
});

router.post("/resendEmailVerification", async (req, res, next) => {
  console.log("resend email verification");
  console.log(req.body["publicAddress"]);

  // check if the user exists
  let userModel: User = await userAuthDbService.selectOneRowByPrimaryId(
    req.body.publicAddress
  );

  if (userModel == null) {
    // if not, create the user and send back to frontend
    console.log("user doesn't exist");
    res.status(400);
    res.send(false);
  } else {
    let success = await emailsModule.sendVerificationEmail(
      req.body.publicAddress
    );
    console.log("success", success);
    if (!success) {
      res.status(500);
    }
    res.send(success);
  }
});

/**
 * Verify the email of a user by verifying the jwt token sent to their inbox
 * This route is designated as a get because it is sent as a link in html in a verification email
 */
router.get("/verifyEmail/:jwtToken", async (req, res, next) => {
  let jwtPayload;
  // Attempt to validate the token and get public address
  try {
    jwtPayload = jwt.verify(req.params.jwtToken, jwtKey);
    res.locals.jwtPayload = jwtPayload;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // JWT is unauthorized
      return res.status(401).end();
    }
    // Bad request errror
    return res.status(400).end();
  }

  const updateStatus = await userEmailDbService.updateEmailVerificationStatus(
    res.locals.jwtPayload.publicAddress
  );
  if (updateStatus) {
    // Their email was verified and now we can send them to the homepage
    return res.redirect("https://verifiable-reference-letter.herokuapp.com");
  } else {
    // Otherwise our update failed
    return res.status(500).end();
  }
});

export { router };
