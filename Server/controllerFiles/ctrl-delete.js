require('dotenv').config();

const Sequelize = require('sequelize');
const {CONNECTION_STRING: conStr } = process.env;

const sequelize = new Sequelize(conStr, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
})

module.exports = {
  deleteUser: (req, res) => {

  },
  deleteLaser: (req, res) => {

  },
  deleteJob: (req, res) => {
    
  }
}