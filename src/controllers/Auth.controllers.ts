import express from "express";
import { AuthModule } from "../modules/Auth.module";
// import { UserDbService } from "../database/users/User.dbservice";
import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
import { User } from "../database/users/User.dbmodel";
import { UserAuth } from "../database/users/UserAuth.dbmodel";

import * as jwt from "jsonwebtoken";
import { UserEmailDbService } from "../database/users/UserEmail.dbservice";
import { EmailsModule } from "../modules/Emails.module";

const router = express.Router();

const authModule: AuthModule = new AuthModule();
// const usersDbService: UserDbService = new UserDbService();
const userAuthDbService: UserAuthDbService = new UserAuthDbService();
const userEmailDbService: UserEmailDbService = new UserEmailDbService();

// TODO: change this to be hidden
const jwtKey: string = "my private key";

const emailsModule: EmailsModule = new EmailsModule();

router.get('/sendEmail', async (req, res, next) => {
    console.log('sending email');
    // console.log({ key: process.env.SENDGRID_API_KEY });
    await emailsModule.sendEmailToWriter('0xc315345cab7088e46304e02c097f0a922893302c', '0xc315345cab7088e46304e02c097f0a922893302c');
    res.send("hello");
});


router.post("/", async (req, res, next) => {
  console.log("Authenticating");
  const publicAddress: string = req.body.publicAddress;
  let userModel = await userAuthDbService.selectOneRowByPrimaryId(
    publicAddress
  );
  const verifySuccess: boolean = await authModule.verifySignature(
    userModel.nonce,
    req.body.signature,
    publicAddress
  );

  let jwtToken;
  if (verifySuccess === true) {
    // TODO: currently verification is broken
    console.log("verified success");
    jwtToken = jwt.sign({ publicAddress }, jwtKey, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    console.log(jwtToken);
    res.send(
      JSON.stringify({
        data: { jwtToken: jwtToken, publicAddress: publicAddress },
      })
    );
  } else {
    console.log(verifySuccess, "something went wrong with verification");
    res.send(
      JSON.stringify({
        data: {}
      })
    );
  }
});

router.post("/users/create", async (req, res, next) => {
  console.log("Creating user");
  console.log(req.body["publicAddress"]);
  console.log(req.body["name"]);
  // check if the user is already created
  let userModel: UserAuth = await userAuthDbService.selectOneRowByPrimaryId(
    req.body.publicAddress
  );
  if (userModel == null) {
    // if not, create the user and send back to frontend
    console.log("user doesn't exist, creating user");
    userModel = await userAuthDbService.createUser(
      req.body.publicAddress,
      req.body.name
    );
  }
  console.log("user exists, no need to create user"); // ADD SOME INDICATION IN RESPONSE
  console.log(userModel);
  res.send([userModel]);
});

router.get("/users/:publicAddress", async (req, res, next) => {
  console.log("Got into users GET for single address");
  const userModel: UserAuth = await userAuthDbService.getUserAuth(
    req.params.publicAddress
  );
  res.send([userModel]);
});

/**
 * Verify the email of a user by verifying the jwt token sent to their inbox
 */
router.post("/verifyEmail/:jwtToken", async (req, res, next) => {

  let jwtPayload;
  // Attempt to validate the token and get public address
  try {
     jwtPayload = jwt.verify(req.params.jwtToken, jwtKey);
     res.locals.jwtPayload = jwtPayload
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // JWT is unauthorized
      return res.status(401).end();
    }
    // Bad request errror
    return res.status(400).end();
  }

  const updateStatus = await userEmailDbService.updateEmailVerificationStatus(res.locals.jwtPayload.publicAddress);
  if (updateStatus) {
    // Their email was verified and now we can send them to the homepage
    return res.redirect('https://verifiable-reference-letter.herokuapp.com');
  }
  else {
    // Otherwise our update failed 
    return res.status(500).end();
  }
});

export { router };
