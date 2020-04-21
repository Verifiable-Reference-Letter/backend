"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const port = 8080; // default port to listen
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
const testApi_1 = require("./routes/testApi");
app.use(cors_1.default());
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.get("/bye", (req, res) => {
    const x = 10;
    res.send("Bye world!" + x);
});
app.use("/testAPI", testApi_1.router);
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
module.exports = app;
//# sourceMappingURL=app.js.map