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
  getAllJobs: (req, res) => {

  },
  getApprovedJobs: (req, res) => {

  },
  getCompletedJobs: (req, res) => {

  },
  getUserInfo: (req, res) => {

  },
  getLaser: (req, res) => {

  },
  getUserDefaults: (req, res) => {

  },
  getJobDefaults: (req, res) => {

  },
  getQtyAndHourly: (req, res) => {

  }
}