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
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateLaser: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateFlatSpeedData: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateRotarySpeedData: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateJob: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateFlatJob: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateCustomJobData: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateJobApproved: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  updateJobCompleted: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  }
}