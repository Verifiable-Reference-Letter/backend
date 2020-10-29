import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
// import { Keccak } from "sha3";
import { utf8tohex } from "jsrsasign";
// import * as E from "cryptojs"
//import  * as jwt from "jsonwebtoken";
import * as EthUtil from "ethereumjs-util";
// import * as EthTx from "ethereumjs-tx";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserKey } from "../database/users/UserKey.dbmodel";
import { UserKeyDbService } from "../database/users/UserKey.dbservice";

// TODO: change this to be hidden
const jwtKey: string = "my private key";

export class AuthModule {
  private userAuthDbService: UserAuthDbService;
  private userKeyDbService: UserKeyDbService;
  // private sessionMap: Map<string, Date>;
  // private jwtKey: string;

  constructor() {
    this.userAuthDbService = new UserAuthDbService();
    this.userKeyDbService = new UserKeyDbService();
    // this.sessionMap = new Map();
  }

  /**
   * verify signature corresponds to message and public address by using ecrecover
   * @param message
   * @param signature
   * @param publicAddress
   */
  async verifySignature(
    message: string,
    signature: string,
    publicAddress: string
  ): Promise<boolean> {
    // const sig = signature.slice(2, signature.length);
    // const offset = 2;
    // const r = signature.slice(0 + offset, 64 + offset);
    // const s = signature.slice(64 + offset, 128 + offset);
    // const v = parseInt(signature[128 + offset], 16) + parseInt(signature[129 + offset], 16); // incorrect
    // const v = 28;
    // console.log("r", r);
    // console.log("s", s);
    // console.log("v", v);
    // console.log("signature", signature);
    // console.log("sig", sig);

    // const messageHash = new Keccak(256);
    const messageHash = EthUtil.hashPersonalMessage(Buffer.from(message));

    const hash = messageHash.toString("hex");
    const hash2 = utf8tohex(hash);
    // console.log("publicAddress", publicAddress);
    // console.log("nonce", userModel.nonce);
    // console.log("hash", hash);
    // console.log("hash2", hash2);
    const sg = EthUtil.fromRpcSig(signature); // YES

    // const prefix = "\x19Ethereum Signed Message:\n" + nonce.length;
    // const prefix ="\x19Ethereum Signed Message:\n32"; //+ String.fromCharCode(hash.length);
    // const prefixedHash = EthUtil.keccak256(prefix + hash);
    // console.log("prefixedHash", prefixedHash.toString("hex"));
    const publicKey = EthUtil.ecrecover(
      //  prefixedHash,
      // messageHash.digest(),
      Buffer.from(hash, "hex"),
      //   EthUtil.toBuffer(EthUtil.keccak256(prefixedNonce)),
      sg.v,
      // new Buffer("0x" + sg.r.toString("hex")),
      // new Buffer("0x" + sg.s.toString("hex")),
      sg.r,
      sg.s
    );
    const pubAddress = EthUtil.bufferToHex(EthUtil.pubToAddress(publicKey));
    // console.log("sg.v", sg.v);
    // console.log("sg.r", sg.r.toString("hex"));
    // console.log("sg.s", sg.s.toString("hex"));
    // console.log("publicKey", "0x" + publicKey.toString("hex"));
    // console.log("pubAddress", pubAddress);

    return (
      EthUtil.toChecksumAddress(pubAddress) ===
      EthUtil.toChecksumAddress(publicAddress)
    );

    // if (
    //   EthUtil.toChecksumAddress(pubAddress) ===
    //   EthUtil.toChecksumAddress(publicAddress)
    // ) {
    //   // TODO: differentiate between failed verification and failed update of public key
    //   const userKey: UserKey = await this.userKeyDbService.selectUserKey(
    //     publicAddress
    //   );
    //   if (!userKey || userKey.publicKey === null) {
    //     const successfulUpdate = await this.userKeyDbService.updateUserKey(
    //       publicAddress,
    //       "0x" + publicKey.toString("hex")
    //     );
    //     // console.log(successfulUpdate, "update of public key");
    //     return successfulUpdate;
    //   }
    //   // console.log("public key already exists");
    //   return true;
    // }
    // return false;
  }

  /**
   * verify user jwtToken
   * @param req
   * @param res
   * @param next
   */
  static verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.body.auth.jwtToken;
    let jwtPayload;

    // Attempt to validate the token and get public address
    try {
      jwtPayload = jwt.verify(token, jwtKey);
      res.locals.jwtPayload = jwtPayload;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        // JWT is unauthorized
        return res.status(401).end();
      }
      // Bad request errror
      return res.status(400).end();
    }

    // Refresh the users token on request
    const publicAddress = jwtPayload;
    const newToken = jwt.sign({ publicAddress }, jwtKey, {
      expiresIn: "1h",
    });
    res.locals.newJwtToken = newToken;

    next();
  }
}
