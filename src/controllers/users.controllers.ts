import express from "express";
import { UserDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
import { UserProfile } from "../database/users/UserProfile.dbmodel";
import { UserProfileDbService } from "../database/users/UserProfile.dbservice";
import { AuthModule } from "../modules/Auth.module"; 
const router = express.Router();

const userDbService: UserDbService = new UserDbService();
const userProfileDbService: UserProfileDbService = new UserProfileDbService();

router.use(AuthModule.verifyUser);

/**
 * get all users (basic info)
 */
router.post("/", async (req, res, next) => {
  console.log("getting all users except self");
  const userModels: User[] = await userDbService.selectAllUsersExceptSelf(
    res.locals.jwtPayload.publicAddress
  ); // TODO: change to subtract user self
  console.log(userModels);
  res.json(
    { 
    auth: { 
      jwtToken: res.locals.newJwtToken
    }, 
    data: userModels
    });
});

/**
 * get user (basic info) by publicAddress
 */
router.post("/:publicAddress", async (req, res, next) => {
  console.log("Get the user profile by publicAddress");
  const userModel: User[] = await userDbService.selectUserByPublicAddress(
    req.params.publicAddress
  );
  console.log(userModel);
  if (userModel.length !== 0) {
    res.json(
      { 
      auth: { 
        jwtToken: res.locals.newJwtToken
      }, 
      data: userModel
      });
  } else {
    res.status(400);
    res.json(
      { 
      auth: { 
        jwtToken: res.locals.newJwtToken
      }, 
      data: []
      });
  }
});

/**
 * get user profile by publicAddress
 */
router.post("/:publicAddress/profile", async (req, res, next) => {
  console.log("Get the user profile by publicAddress");
  const userProfileModel: UserProfile[] = await userProfileDbService.selectUserByPublicAddress(
    req.params.publicAddress
  );
  console.log(userProfileModel);
  if (userProfileModel.length !== 0) {
    res.json(
      { 
      auth: { 
        jwtToken: res.locals.newJwtToken
      }, 
      data: userProfileModel
      });
  } else {
    res.status(400);
    res.json(
      { 
      auth: { 
        jwtToken: res.locals.newJwtToken
      }, 
      data: userProfileModel
      });
  }
});

/**
 * send email to publicAddress (req.param) from req.body.auth.publicAddress
 * TODO: Not Yet Implemented
 */
router.post("/:publicAddress/sendEmail", async (req, res, next) => {
  console.log("send email to publicAddress");
});

export { router };
