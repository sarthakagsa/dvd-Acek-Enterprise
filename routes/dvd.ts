import { error, log } from "console"
import express from "express"
import request from 'request'
import { where } from "sequelize"
let dvdrouter = express.Router()
import { db } from "../database/db"
import { dvd } from "../models/dvd"
import Sequelize from 'sequelize';

//Create Product
dvdrouter.post('/api/v1/dvd-online/seller/products/create', (req, res) => {
    let data = req.body
    request('http://www.omdbapi.com/?t=' + data.movieTitle + '&y=' + data.releaseYear + '&apikey=31e0006f', function (error, response, body) {
        if (error) {
            res.status(400).send(error)
        }
        let apiData = JSON.parse(response.body)
        if (apiData.Error) {
            res.status(400).send(apiData.Error)
        } else {
            dvd.create({
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
                .then(dvd => res.send({ err: false, dvd, message: "Product has been created successfully" }))
                .catch(err => console.log(err))
        }
    })
})

//Sell Product
dvdrouter.post('/api/v1/dvd-online/seller/products/sell', (req, res) => {
    let data = req.body
    dvd.update({
        mrp: data.mrp,
        inventory: data.inventory,
        sellingPrice: data.sellingPrice,
        shippingPrice: data.shippingPrice,
        isSellable: true,
        unitssold: 0
    }, { where: { id: data.productId } })
        .then((result) => {
            if (result[0] == 0) {
                res.status(400).send('Product not found')
            } else {
                res.send({
                    "err": false,
                    "message": "Product price & inventory saved successfully"
                })
            }
        })
        .catch(error => res.status(400).send(error))
})

//Mark product unsellable
dvdrouter.post('/api/v1/dvd-online/seller/products/unsell', (req, res) => {
    let data = req.body
    dvd.update({
        isSellable: false,
    }, { where: { id: data.productId } })
        .then((result) => {
            if (result[0] == 0) {
                res.status(400).send('Product not found')
            } else {
                res.send({
                    "err": false,
                    "message": "Product has been marked unsellable successfully"
                })
            }
        })
        .catch(error => res.status(400).send(error))
})

//Delete Product
dvdrouter.delete('/api/v1/dvd-online/seller/products/:productId', (req, res) => {
    let id = req.params.productId
    dvd.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        if (result == 0) {
            res.status(400).send('Product not found')
        } else {
            res.send({
                "err": false,
                "message": "The product has been deleted successfully"
            })
        }
    }).catch(error => res.status(400).send(error))
})

//All selable Product
dvdrouter.get('/api/v1/dvd-online/seller/products/list/sellable', (req, res) => {
    dvd.findAll()
        .then(result => res.send({
            "err": false,
            "data": result,
            "message": "Product has been marked unsellable successfully"
        }))
        .catch(error => res.status(400).send(error))
})

//All out of stock product
dvdrouter.get('/api/v1/dvd-online/seller/products/list/out-of-stock', (req, res) => {
    dvd.findAll({
        where: {
            inventory: 0
        }
    })
        .then(result => res.send({
            "err": false,
            "data": result,
            "message": "Products which are out of stock"
        }))
        .catch(error => res.status(400).send(error))
})

//List top N sold products
dvdrouter.get('/api/v1/dvd-online/seller/products/list/top-n-sold/:count', (req, res) => {
    dvd.findAll({
        order: Sequelize.literal('unitssold DESC'),
        limit: parseInt(req.params.count),
    }).then(result => res.send(result))
})

//Place Order
dvdrouter.post('/api/v1/dvd-online/customer/place-order', async (req, res) => {
    let cost = 0
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            let id = req.body[key]
            let result = await dvd.findOne({
                where: {
                    id: id
                }
            })
            const shippingPrice = (result as any).shippingPrice
            const sellingPrice = (result as any).sellingPrice
            cost += shippingPrice + sellingPrice
            const inventory = (result as any).inventory
            const unitssold = (result as any).unitssold
            dvd.update({
                inventory: inventory - 1,
                unitssold: unitssold + 1
            }, { where: { id: id } })
        }
        else {
            res.status(400).send('DVD not found')
        }
    }
    res.send({
        "err": false ,
        "data": {
        cost
        },
        "message": "Order has been placed successfully"
        })

})

export {
    dvdrouter
}

// res.status(200).send({
//     "err": false ,
//     "data": {
//     "cost": shippingPrice + sellingPrice
//     },
//     "message": "Order has been placed successfully"
//     })

