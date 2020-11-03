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
const Express_1 = __importDefault(require("Express"));
const Emails_module_1 = require("../modules/Emails.module");
const router = Express_1.default.Router();
exports.router = router;
const emailsModule = new Emails_module_1.EmailsModule();
router.get('/sendEmail', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('sending email');
    // console.log({ key: process.env.SENDGRID_API_KEY });
    yield emailsModule.sendEmailToWriter('0xc315345cab7088e46304e02c097f0a922893302c', '0xc315345cab7088e46304e02c097f0a922893302c');
    res.send("hello");
}));
//# sourceMappingURL=Emails.controllers.js.map