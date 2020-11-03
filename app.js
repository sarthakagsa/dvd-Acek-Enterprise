"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var db_1 = require("./database/db");
var dvd_1 = require("./routes/dvd");
var body_parser_1 = __importDefault(require("body-parser"));
var app = express_1.default();
db_1.db.authenticate()
    .then(function () { console.log('Database Connected'); })
    .catch(function (err) { console.log('Database not Connected ' + err); });
app.use(body_parser_1.default.json());
app.use(dvd_1.dvdrouter);
app.listen(4000, function () {
    console.log('Port is set on 4000');
});
