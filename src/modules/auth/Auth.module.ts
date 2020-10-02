import { UsersDbService } from "../../database/users/User.dbservice";
import { Keccak } from "sha3";
import { KJUR } from "jsrsasign";
//import  * as jwt from "jsonwebtoken";
import * as EthUtil from "ethereumjs-util";
import * as EthTx from "ethereumjs-tx";

export class AuthModule {
  private usersDbService: UsersDbService;
  private sessionMap: Map<string, Date>;
  private jwtKey: string;

  constructor() {
    this.usersDbService = new UsersDbService();
    this.sessionMap = new Map();
  }

  async authorizeUser(signature: string, address: string) {
    let userModel = await this.usersDbService.selectOneRowByPrimaryId(address);
    const sig = signature.slice(2, signature.length);
    const offset = 2;
    // const r = signature.slice(0 + offset, 64 + offset);
    // const s = signature.slice(64 + offset, 128 + offset);
    // const v = parseInt(signature[128 + offset], 16) + parseInt(signature[129 + offset], 16);
    // const v = 28;
    // console.log("r", r);
    // console.log("s", s);
    // console.log(v);
    console.log("signature", signature);
    console.log("sig", sig);

    const nonce = userModel.nonce;
    const messageHash = new Keccak(256);
    messageHash.update(userModel.nonce);
    const hash = messageHash.digest().toString("hex");
    console.log("publicAddress", address);
    console.log("nonce", userModel.nonce);
    console.log("hash", hash);
    const sg = EthUtil.fromRpcSig(signature); // YES

    const prefixedNonce = "\x19Ethereum Signed Message:\n" + nonce.length + nonce;
    // const prefix =
    //   "\x19" + "Ethereum Signed Message:\n32"; //+ String.fromCharCode(hash.length);
    // const prefixedHash = EthUtil.keccak256(prefix + nonce);
    // console.log("prefixedHash", prefixedHash.toString("hex"));
    const pub = EthUtil.ecrecover(
    //   prefixedHash,
        // messageHash.digest(),
      EthUtil.toBuffer(EthUtil.keccak256(prefixedNonce)),
      sg.v,
        // new Buffer("0x" + sg.r.toString("hex")),
        // new Buffer("0x" + sg.s.toString("hex")),
      sg.r,
      sg.s,
    );
    const pubAddress = EthUtil.bufferToHex(EthUtil.pubToAddress(pub));

    console.log("sg.v", sg.v);
    console.log("sg.r", sg.r.toString("hex"));
    console.log("sg.s", sg.s.toString("hex"));
    console.log("pub", pub.toString("hex"));
    console.log("pubAddress", pubAddress);

    let ec2 = new KJUR.crypto.ECDSA({ curve: "secp256r1" });
    let result2 = ec2.verifyHex(
      messageHash.digest("hex"),
      sig,
      pub.toString("hex")
    );
    console.log(result2);

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

    return result2;
  }
}
