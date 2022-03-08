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
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  deleteLaser: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  deleteJob: (req, res) => {
    let { userId } = req.params;

userId = sequelize.escape(userId);

    sequelize
    .query(`

    SELECT jobs_data_id
    FROM jobs_data
    WHERE user_id = ${userId};

    `)
    .then(dbRes => {
      const {jobs_data_id} = dbRes[0][0];
      console.log(dbRes[0], jobs_data_id)
      sequelize
        .query(`
        DELETE FROM jobs_data_flat
        WHERE jobs_data_id = ${jobs_data_id};

        DELETE FROM jobs_data_rotary
        WHERE jobs_data_id = ${jobs_data_id};

        DELETE FROM invoice
        WHERE jobs_datA_id = ${jobs_data_id};

        DELETE FROM jobs_data
        WHERE user_id = ${userId};
        `)
        .then(dbRes => res.sendStatus(200))
        .catch(err => res.status(400).send(err))
    })
    .catch(err => res.status(400).send(err))
  }
}