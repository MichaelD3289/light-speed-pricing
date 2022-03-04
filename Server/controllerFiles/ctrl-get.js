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
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getApprovedJobs: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getCompletedJobs: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getUserInfo: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getLaser: (req, res) => {
  let user = req.params.userId;
    user = sequelize.escape(user);

    sequelize
    .query(`
     SELECT table_width, table_height, 

     lmf.density_used flat_density, lmf.speed_used flat_speed, flat_one_by_one fone, flat_two_by_one ftwoOne, flat_three_by_one fthreeOne, flat_one_by_two foneTwo, flat_one_by_three foneThree, flat_two_by_two ftwoTwo, flat_three_by_three fthreeThree,

     lmr.density_used rotary_density, lmr.speed_used rotary_speed, rotary_one_by_one rone, rotary_two_by_one rtwoOne, rotary_three_by_one rthreeOne, rotary_one_by_two roneTwo, rotary_one_by_three roneThree, rotary_two_by_two rtwoTwo, rotary_three_by_three rthreeThree

     FROM laser_machines AS lm
     JOIN laser_machine_speed_flat AS lmf
      ON lm.laser_id = lmf.laser_id
     JOIN laser_machine_speed_rotary AS lmr
     ON lmf.laser_id = lmr.laser_id
     WHERE added_by = ${user};
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  getUserDefaults: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getJobDefaults: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  },
  getQtyAndHourly: (req, res) => {
    sequelize
    .query(`
    `)
    .then()
    .catch(err => res.status(400).send(err))
  }
}