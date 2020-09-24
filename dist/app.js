"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const port = process.env.PORT || 8080; // default port to listen
console.log("Process env: ");
console.dir(process.env);
console.log("Dynamic port: " + process.env.PORT);
console.log("Port chosen: " + port);
// Serve static files from the React app
const testApi_1 = require("./routes/testApi");
const users_controllers_1 = require("./controllers/users.controllers");
const Letters_controllers_1 = require("./controllers/Letters.controllers");
const Emails_controllers_1 = require("./controllers/Emails.controllers");
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
app.use(cors_1.default());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.get("/bye", (req, res) => {
    const x = 10;
    res.send("Bye world!" + x);
});
app.use("/testAPI", testApi_1.router);
app.use("/users", users_controllers_1.router);
app.use("/letters", Letters_controllers_1.router);
app.use("/emails", Emails_controllers_1.router);
// start the Express server
app.listen(port, () => {
    console.log(`server listening on port:${port}`);
});
module.exports = app;
//# sourceMappingURL=app.js.map