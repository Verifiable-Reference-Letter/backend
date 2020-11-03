"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_dbservice_1 = require("../database/users/User.dbservice");
const UserProfile_dbservice_1 = require("../database/users/UserProfile.dbservice");
const Auth_module_1 = require("../modules/Auth.module");
const router = express_1.default.Router();
exports.router = router;
const userDbService = new User_dbservice_1.UserDbService();
const userProfileDbService = new UserProfile_dbservice_1.UserProfileDbService();
router.use(Auth_module_1.AuthModule.verifyUser);
/**
 * get all users (basic info)
 */
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getting all users except self");
    const userModels = yield userDbService.selectAllUsersExceptSelf(res.locals.jwtPayload.publicAddress); // TODO: change to subtract user self
    console.log(userModels);
    res.json({
        auth: {
            jwtToken: res.locals.newJwtToken,
        },
        data: userModels,
    });
}));
/**
 * get user (basic info) by publicAddress
 */
router.post("/:publicAddress", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get the user profile by publicAddress");
    const userModel = yield userDbService.selectUserByPublicAddress(req.params.publicAddress);
    console.log(userModel);
    if (userModel.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: userModel,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: [],
        });
    }
}));
/**
 * get user profile by publicAddress
 */
router.post("/:publicAddress/profile", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get the user profile by publicAddress");
    const userProfileModel = yield userProfileDbService.selectUserProfileByPublicAddress(req.params.publicAddress);
    console.log(userProfileModel);
    if (userProfileModel.length !== 0) {
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: userProfileModel,
        });
    }
    else {
        res.status(400);
        res.json({
            auth: {
                jwtToken: res.locals.newJwtToken,
            },
            data: userProfileModel,
        });
    }
}));
//# sourceMappingURL=users.controllers.js.map