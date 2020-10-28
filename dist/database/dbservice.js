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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const User_dbmodel_1 = require("./users/User.dbmodel");
const LetterContents_dbmodel_1 = require("./letter_contents/LetterContents.dbmodel");
class DatabaseService {
    constructor() {
        this.clientCredentials = {};
        this.dbModels = [];
        // Temporary for testing until we implement running in development and production modes
        this.clientCredentials = {
            connectionString: process.env.DATABASE_URL ||
                "postgres://plrnqvkoieossi:6e67d9a93ad03361124f172fa865b56e16966f7edd112dc0d4be24e303399d00@ec2-52-86-73-86.compute-1.amazonaws.com:5432/d4ur44i35a17si",
            ssl: true,
        };
    }
    selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbModels = [];
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                const res = yield client.query(this.selectAllQuery);
                let jsonRow;
                for (const row of res.rows) {
                    jsonRow = JSON.stringify(row);
                    console.log("got to json row");
                    console.log(jsonRow);
                    this.dbModels.push(this.dbRowToDbModel(row));
                }
                this.dbModels.filter((value) => {
                    if (value) {
                        Object.keys(value).length !== 0;
                    }
                });
                this.dbModels.map((value, index) => {
                    console.log("Db Model " + index + ": ");
                    console.dir(value);
                });
                return this.dbModels;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    selectOneRowByPrimaryId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [id];
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                const res = yield client.query(this.selectOneRowByIdQuery, values);
                if (res.rows.length === 0) {
                    return null;
                }
                let jsonRow;
                jsonRow = JSON.stringify(res.rows[0]);
                console.log(jsonRow);
                const dbModel = this.dbRowToDbModel(res.rows[0]);
                console.dir(dbModel);
                return dbModel;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    runParameterizedQueryWithValuesArray(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbModels = [];
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                const res = yield client.query(queryText, values);
                let jsonRow;
                for (const row of res.rows) {
                    jsonRow = JSON.stringify(row);
                    console.log(jsonRow);
                    dbModels.push(this.dbRowToDbModel(row));
                }
                dbModels.filter((value) => {
                    if (value) {
                        Object.keys(value).length !== 0;
                    }
                });
                dbModels.map((value, index) => {
                    console.log("Db Model " + index + ": ");
                    console.dir(value);
                });
                return dbModels;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    runParameterizedQueryWithValuesArrayCount(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                const res = yield client.query(queryText, values);
                return res.rowCount;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    runParameterizedQueryWithValuesArrayContents(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            const models = [];
            client.connect();
            try {
                const res = yield client.query(queryText, values);
                // let jsonRow;
                for (const row of res.rows) {
                    // jsonRow = JSON.stringify(row);
                    // console.log(jsonRow);
                    models.push(LetterContents_dbmodel_1.LetterContents.dbRowToDbModel(row));
                }
                models.filter((value) => {
                    if (value) {
                        Object.keys(value).length !== 0;
                    }
                });
                models.map((value, index) => {
                    console.log("Db Model " + index + ": ");
                    // console.dir(value);
                });
                return models;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    runParameterizedQueryWithValuesArrayUser(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            const models = [];
            client.connect();
            try {
                const res = yield client.query(queryText, values);
                let jsonRow;
                for (const row of res.rows) {
                    jsonRow = JSON.stringify(row);
                    console.log(jsonRow);
                    models.push(User_dbmodel_1.User.dbRowToDbModel(row));
                }
                models.filter((value) => {
                    if (value) {
                        Object.keys(value).length !== 0;
                    }
                });
                models.map((value, index) => {
                    console.log("Db Model " + index + ": ");
                    console.dir(value);
                });
                return models;
            }
            catch (err) {
                console.log(err.stack);
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
        });
    }
    runParameterizedQueryWithValuesArrayInsert(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                yield client.query(queryText, values);
            }
            catch (err) {
                console.log(err.stack);
                return false;
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
            return true;
        });
    }
    runParameterizedQueryWithValuesArrayDelete(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                yield client.query(queryText, values);
            }
            catch (err) {
                console.log(err.stack);
                return false;
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
            return true;
        });
    }
    runParameterizedQueryWithValuesArrayUpdate(queryText, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.clientCredentials);
            client.connect();
            try {
                yield client.query(queryText, values);
            }
            catch (err) {
                console.log(err.stack);
                return false;
            }
            finally {
                client.end().then(() => console.log("client has disconnected"));
            }
            return true;
        });
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=dbservice.js.map