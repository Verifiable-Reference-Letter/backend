import express from "express";
import { AuthModule } from "../modules/auth/Auth.module";
import  * as jwt from "jsonwebtoken";

const router = express.Router();

const authModule: AuthModule = new AuthModule();

// TODO: change this to be hidden
const jwtKey: string = "my private key";

router.get('/', async (req, res, next) => {
    console.log("Getting all users");
    // TODO: check with frontend what is being passed 
    const publicAddress: string = req.body.publicAddress;
    const authResult = await authModule.authorizeUser(req.body.signature, publicAddress);

    let jwtToken;
    if (authResult == true) {
        jwtToken = jwt.sign({ publicAddress }, jwtKey, {
            algorithm: "HS256",
            expiresIn: "1h",
        })
    }
    res.send(jwtToken);
});

export { router }