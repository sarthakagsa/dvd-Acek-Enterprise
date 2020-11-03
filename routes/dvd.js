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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dvdrouter = void 0;
var express_1 = __importDefault(require("express"));
var request_1 = __importDefault(require("request"));
var dvdrouter = express_1.default.Router();
exports.dvdrouter = dvdrouter;
var dvd_1 = require("../models/dvd");
var sequelize_1 = __importDefault(require("sequelize"));
//Create Product
dvdrouter.post('/api/v1/dvd-online/seller/products/create', function (req, res) {
    var data = req.body;
    request_1.default('http://www.omdbapi.com/?t=' + data.movieTitle + '&y=' + data.releaseYear + '&apikey=31e0006f', function (error, response, body) {
        if (error) {
            res.status(400).send(error);
        }
        var apiData = JSON.parse(response.body);
        if (apiData.Error) {
            res.status(400).send(apiData.Error);
        }
        else {
            dvd_1.dvd.create({
                movieTitle: apiData.Title,
                releaseYear: apiData.Year,
                length: apiData.Runtime,
                director: apiData.Director,
                plot: apiData.Plot,
                cast: apiData.Actors,
                imdbRaiting: apiData.imdbRating,
                language: apiData.Language,
                genre: apiData.Genre
            })
                .then(function (dvd) { return res.send({ err: false, dvd: dvd, message: "Product has been created successfully" }); })
                .catch(function (err) { return console.log(err); });
        }
    });
});
//Sell Product
dvdrouter.post('/api/v1/dvd-online/seller/products/sell', function (req, res) {
    var data = req.body;
    dvd_1.dvd.update({
        mrp: data.mrp,
        inventory: data.inventory,
        sellingPrice: data.sellingPrice,
        shippingPrice: data.shippingPrice,
        isSellable: true,
        unitssold: 0
    }, { where: { id: data.productId } })
        .then(function (result) {
        if (result[0] == 0) {
            res.status(400).send('Product not found');
        }
        else {
            res.send({
                "err": false,
                "message": "Product price & inventory saved successfully"
            });
        }
    })
        .catch(function (error) { return res.status(400).send(error); });
});
//Mark product unsellable
dvdrouter.post('/api/v1/dvd-online/seller/products/unsell', function (req, res) {
    var data = req.body;
    dvd_1.dvd.update({
        isSellable: false,
    }, { where: { id: data.productId } })
        .then(function (result) {
        if (result[0] == 0) {
            res.status(400).send('Product not found');
        }
        else {
            res.send({
                "err": false,
                "message": "Product has been marked unsellable successfully"
            });
        }
    })
        .catch(function (error) { return res.status(400).send(error); });
});
//Delete Product
dvdrouter.delete('/api/v1/dvd-online/seller/products/:productId', function (req, res) {
    var id = req.params.productId;
    dvd_1.dvd.destroy({
        where: {
            id: id
        }
    }).then(function (result) {
        if (result == 0) {
            res.status(400).send('Product not found');
        }
        else {
            res.send({
                "err": false,
                "message": "The product has been deleted successfully"
            });
        }
    }).catch(function (error) { return res.status(400).send(error); });
});
//All selable Product
dvdrouter.get('/api/v1/dvd-online/seller/products/list/sellable', function (req, res) {
    dvd_1.dvd.findAll()
        .then(function (result) { return res.send({
        "err": false,
        "data": result,
        "message": "Product has been marked unsellable successfully"
    }); })
        .catch(function (error) { return res.status(400).send(error); });
});
//All out of stock product
dvdrouter.get('/api/v1/dvd-online/seller/products/list/out-of-stock', function (req, res) {
    dvd_1.dvd.findAll({
        where: {
            inventory: 0
        }
    })
        .then(function (result) { return res.send({
        "err": false,
        "data": result,
        "message": "Products which are out of stock"
    }); })
        .catch(function (error) { return res.status(400).send(error); });
});
//List top N sold products
dvdrouter.get('/api/v1/dvd-online/seller/products/list/top-n-sold/:count', function (req, res) {
    dvd_1.dvd.findAll({
        order: sequelize_1.default.literal('unitssold DESC'),
        limit: parseInt(req.params.count),
    }).then(function (result) { return res.send(result); });
});
//Place Order
dvdrouter.post('/api/v1/dvd-online/customer/place-order', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cost, _a, _b, _i, key, id, result, shippingPrice, sellingPrice, inventory, unitssold;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                cost = 0;
                _a = [];
                for (_b in req.body)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                key = _a[_i];
                if (!req.body.hasOwnProperty(key)) return [3 /*break*/, 3];
                id = req.body[key];
                return [4 /*yield*/, dvd_1.dvd.findOne({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                result = _c.sent();
                shippingPrice = result.shippingPrice;
                sellingPrice = result.sellingPrice;
                cost += shippingPrice + sellingPrice;
                inventory = result.inventory;
                unitssold = result.unitssold;
                dvd_1.dvd.update({
                    inventory: inventory - 1,
                    unitssold: unitssold + 1
                }, { where: { id: id } });
                return [3 /*break*/, 4];
            case 3:
                res.status(400).send('DVD not found');
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5:
                res.send({
                    "err": false,
                    "data": {
                        cost: cost
                    },
                    "message": "Order has been placed successfully"
                });
                return [2 /*return*/];
        }
    });
}); });
// res.status(200).send({
//     "err": false ,
//     "data": {
//     "cost": shippingPrice + sellingPrice
//     },
//     "message": "Order has been placed successfully"
//     })
