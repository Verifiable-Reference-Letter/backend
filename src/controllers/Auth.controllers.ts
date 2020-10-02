import express from "express";
import { AuthModule } from "../modules/auth/Auth.module";
import  * as jwt from "jsonwebtoken";

const router = express.Router();

const authModule: AuthModule = new AuthModule();


// TODO: change this to be hidden
const jwtKey: string = "my private key";

router.post('/', async (req, res, next) => {
    console.log("Authenticating");
    // TODO: check with frontend what is being passed 
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
            auth: { jwtToken: jwtToken, publicAddress: publicAddress},
            data: []
        }));
    }
});

export { router }