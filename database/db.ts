
import {Sequelize} from 'sequelize';

let db = new Sequelize('dvd', 'postgres', 'Sarthak@123', {
    host: 'localhost',
    dialect: 'postgres'
  });

export {db}