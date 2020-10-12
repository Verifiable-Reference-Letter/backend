import express from "express";
import { AuthModule } from "../modules/Auth.module";
// import { UserDbService } from "../database/users/User.dbservice";
import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
import { User } from "../database/users/User.dbmodel";
import { UserAuth } from "../database/users/UserAuth.dbmodel";

import  * as jwt from "jsonwebtoken";

const router = express.Router();

const authModule: AuthModule = new AuthModule();
// const usersDbService: UserDbService = new UserDbService();
const userAuthDbService: UserAuthDbService = new UserAuthDbService();

// TODO: change this to be hidden
const jwtKey: string = "my private key";

router.post('/', async (req, res, next) => {
    console.log("Authenticating");
    const publicAddress: string = req.body.publicAddress;
    const authResult = await authModule.authorizeUser(req.body.signature, publicAddress);

    let jwtToken;
    if (authResult === true) { // TODO: currently verification is broken
        console.log("verified success");
        jwtToken = jwt.sign({ publicAddress }, jwtKey, {
            algorithm: "HS256",
            expiresIn: "1h",
        })
        console.log(jwtToken);
        res.send(JSON.stringify({
            // auth: { jwtToken: jwtToken, publicAddress: publicAddress},
            data: { jwtToken: jwtToken, publicAddress: publicAddress},
        }));
    }
});

router.post('/users/create', async (req, res, next) => {
    console.log("Creating user");
    console.log(req.body["publicAddress"]);
    console.log(req.body["name"]);
    // Check if the user is already created
    let userModel: User = await userAuthDbService.selectOneRowByPrimaryId(req.body.publicAddress);
    if (userModel == null) {
        // If not, create the user and send back to frontend
        console.log("user doesn't exist, creating user");
        userModel = await userAuthDbService.createUser(req.body.publicAddress, req.body.name);
    }
    console.log("user exists, no need to create user"); // ADD SOME INDICATION IN RESPONSE
    console.log(userModel);
    res.send([userModel]);
});

router.get('/users/:publicAddress', async (req, res, next) => {
    console.log("Got into users GET for single address");
    const userModel: UserAuth = await userAuthDbService.getUserAuth(req.params.publicAddress);
    res.send([userModel]);
});

export { router }