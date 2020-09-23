import { UsersDbService } from "../../database/users/User.dbservice";
import { Keccak } from "sha3";
import { KJUR } from "jsrsasign";
//import  * as jwt from "jsonwebtoken";


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

        const messageHash = new Keccak(256);
        messageHash.update(userModel.nonce);

        let ec = new KJUR.crypto.ECDSA({'curve': 'secp256r1'});
        let result = ec.verifyHex(messageHash.digest('hex'), signature, userModel.publicAddress);

        return result;
    }

}