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
  addUser: (req, res) => {

  },
  userSignIn: (req, res) => {

  },
  addLaser: (req, res) => {

  },
  addFlatSpeedData: (req, res) => {

  },
  addRotarySpeedData: (req, res) => {

  },
  addDefaultData: (req, res) => {

  },
  addJobDefaults: (req, res) => {

  },
  addDefaultQtyBreaks: (req, res) => {

  },
  addDefaultHourlyRates: (req, res) => {

  },
  addJob: (req, res) => {

  },
  addFlatJob: (req, res) => {

  },
  addCustomJobData: (req, res) => {

  },
  createInvoice: (req, res) => {

  }
}