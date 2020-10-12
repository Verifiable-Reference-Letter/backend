import { UserAuthDbService } from "../database/users/UserAuth.dbservice";
import { Keccak } from "sha3";
import { KJUR, utf8tohex } from "jsrsasign";
// import * as E from "cryptojs"
//import  * as jwt from "jsonwebtoken";
import * as EthUtil from "ethereumjs-util";
import * as EthTx from "ethereumjs-tx";

export class AuthModule {
  private userAuthDbService: UserAuthDbService;
  private sessionMap: Map<string, Date>;
  private jwtKey: string;

  constructor() {
    this.userAuthDbService = new UserAuthDbService();
    this.sessionMap = new Map();
  }

  async authorizeUser(signature: string, publicAddress: string) {
    let userModel = await this.userAuthDbService.selectOneRowByPrimaryId(publicAddress);
    const sig = signature.slice(2, signature.length);
    // const offset = 2;
    // const r = signature.slice(0 + offset, 64 + offset);
    // const s = signature.slice(64 + offset, 128 + offset);
    // const v = parseInt(signature[128 + offset], 16) + parseInt(signature[129 + offset], 16); // incorrect
    // const v = 28;
    // console.log("r", r);
    // console.log("s", s);
    // console.log("v", v);

    console.log("signature", signature);
    console.log("sig", sig);

    const nonce = userModel.nonce;
    // const messageHash = new Keccak(256);
    // messageHash.update(userModel.nonce);
    const messageHash = EthUtil.hashPersonalMessage(Buffer.from(nonce));

    const hash = messageHash.toString("hex");
    const hash2 = utf8tohex(hash);
    console.log("publicAddress", publicAddress);
    console.log("nonce", userModel.nonce);
    console.log("hash", hash);
    console.log("hash2", hash2);
    const sg = EthUtil.fromRpcSig(signature); // YES
 
    // const prefix = "\x19Ethereum Signed Message:\n" + nonce.length;
    // const prefix ="\x19Ethereum Signed Message:\n32"; //+ String.fromCharCode(hash.length);
    // const prefixedHash = EthUtil.keccak256(prefix + hash);
    // console.log("prefixedHash", prefixedHash.toString("hex"));
    const pub = EthUtil.ecrecover(
        //  prefixedHash,
        // messageHash.digest(),
        Buffer.from(hash, "hex"),
        //   EthUtil.toBuffer(EthUtil.keccak256(prefixedNonce)),
        sg.v,
        // new Buffer("0x" + sg.r.toString("hex")),
        // new Buffer("0x" + sg.s.toString("hex")),
        sg.r,
        sg.s,
    );
    const pubAddress = EthUtil.bufferToHex(EthUtil.pubToAddress(pub));
    // EthUtil.toChecksumAddress //
    console.log("sg.v", sg.v);
    console.log("sg.r", sg.r.toString("hex"));
    console.log("sg.s", sg.s.toString("hex"));
    console.log("pub", pub.toString("hex"));
    console.log("pubAddress", pubAddress);

    return EthUtil.toChecksumAddress(pubAddress) === EthUtil.toChecksumAddress(publicAddress);

    // let ec2 = new KJUR.crypto.ECDSA({ curve: "secp256k1" });
    // let result = ec2.verifyHex(
    //   messageHash.toString("hex"),
    //   sig,
    //   pub.toString("hex")
    // );

    // let result2 = ec2.verifyHex(
    //   "0x" + messageHash.toString("hex"),
    //   signature,
    //   "0x" + pub.toString("hex")
    // )
    // console.log(result);
    // console.log(result2);

    // const pk = EthUtil.ecrecover(
    //   messageHash.digest(),
    //   v,
    //   Buffer.from(r, "utf8"),
    //   Buffer.from(s, "utf8")
    // );
    // const publicKey = pk.toString("hex");
    // console.log("publickey", publicKey);

    // const pkHash = new Keccak(256);
    // pkHash.update(publicKey);
    // console.log("address?", pkHash.digest("hex"));
    // console.log("hash", messageHash.digest("hex"));
    // let ec = new KJUR.crypto.ECDSA({ curve: "secp256r1" });
    // let result = ec.verifyHex(
    //   "0x" + messageHash.digest("hex"),
    //   signature,
    //   "0x" + publicKey
    // );
  }
}
