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
const router = express_1.default.Router();
exports.router = router;
const usersDbService = new User_dbservice_1.UsersDbService();
// Get all users
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Getting all users");
    const userModels = yield usersDbService.selectAll();
    res.send(userModels);
}));
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating user");
    const userModel = yield usersDbService.createUser(req.body.public_address, req.body.name);
    res.send([userModel]);
}));
router.get('/:publicAddress', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Got into users GET for single address");
    const userModel = yield usersDbService.selectOneRowByPrimaryId(req.params.publicAddress);
    res.send([userModel]);
}));
//# sourceMappingURL=users.controllers.js.map