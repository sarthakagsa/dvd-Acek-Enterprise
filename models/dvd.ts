import Sequelize from 'sequelize';
import {db} from "../database/db"

let dvd = db.define('dvd',{
    movieTitle : {
        type : Sequelize.STRING 
    },
    releaseYear : {
        type : Sequelize.NUMBER
    },
    length : {
        type : Sequelize.STRING 
    },
    director : {
        type : Sequelize.STRING 
    },
    plot : {
        type : Sequelize.STRING 
    },
    cast : {
        type : Sequelize.STRING 
    },
    imdbRaiting : {
        type : Sequelize.STRING 
    },
    language : {
        type : Sequelize.STRING 
    },
    genre : {
        type : Sequelize.STRING 
    },
    mrp : {
        type : Sequelize.NUMBER
    },
    inventory : {
        type : Sequelize.NUMBER
    },
    sellingPrice : {
        type : Sequelize.NUMBER
    },
    shippingPrice : {
        type : Sequelize.NUMBER
    },
    isSellable : {
        type : Sequelize.STRING
    },
    unitssold : {
        type : Sequelize.NUMBER
    }
})

export {
    dvd
}