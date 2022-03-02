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
  updateUser: (req, res) => {

  },
  updateLaser: (req, res) => {

  },
  updateFlatSpeedData: (req, res) => {

  },
  updateRotarySpeedData: (req, res) => {

  },
  updateUserDefaults: (req, res) => {

  },
  updateJobDefaults: (req, res) => {

  },
  updateQtyBreaks: (req, res) => {

  },
  updateHourlyRates: (req, res) => {

  },
  updateJob: (req, res) => {

  },
  updateCustomJobData: (req, res) => {

  },
  updateJobApproved: (req, res) => {

  },
  updateJobCompleted: (req, res) => {
    
  }
}