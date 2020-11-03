"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dvd = void 0;
var sequelize_1 = __importDefault(require("sequelize"));
var db_1 = require("../database/db");
var dvd = db_1.db.define('dvd', {
    movieTitle: {
        type: sequelize_1.default.STRING
    },
    releaseYear: {
        type: sequelize_1.default.NUMBER
    },
    length: {
        type: sequelize_1.default.STRING
    },
    director: {
        type: sequelize_1.default.STRING
    },
    plot: {
        type: sequelize_1.default.STRING
    },
    cast: {
        type: sequelize_1.default.STRING
    },
    imdbRaiting: {
        type: sequelize_1.default.STRING
    },
    language: {
        type: sequelize_1.default.STRING
    },
    genre: {
        type: sequelize_1.default.STRING
    },
    mrp: {
        type: sequelize_1.default.NUMBER
    },
    inventory: {
        type: sequelize_1.default.NUMBER
    },
    sellingPrice: {
        type: sequelize_1.default.NUMBER
    },
    shippingPrice: {
        type: sequelize_1.default.NUMBER
    },
    isSellable: {
        type: sequelize_1.default.STRING
    },
    unitssold: {
        type: sequelize_1.default.NUMBER
    }
});
exports.dvd = dvd;
