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
const Letter_module_1 = require("../modules/Letter.module");
const router = express_1.default.Router();
exports.router = router;
const letterModule = new Letter_module_1.LetterModule();
// TODO: change these to get the user id from a verified JWT token once we implement logging in functionality
router.get('/:publicAddress/received', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const letterModels = yield letterModule.selectAllSentLetterDetailsByRecipientAddress(req.params.publicAddress);
    res.json(letterModels);
}));
router.get('/:publicAddress/written', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const letterModels = yield letterModule.selectAllSentLetterDetailsByWriterAddress(req.params.publicAddress);
    res.json(letterModels);
}));
router.get('/:publicAddress/requested', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const letterModels = yield letterModule.selectAllSentLetterDetailsByRequestorAddress(req.params.publicAddress);
    res.json(letterModels);
}));
//# sourceMappingURL=Letters.controllers.js.map