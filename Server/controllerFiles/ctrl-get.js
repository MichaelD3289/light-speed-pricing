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
    .then(dbRes =>  res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  getUserInfo: (req, res) => {

  
    let { userId } = req.params
    
    sequelize
    .query(`
    SELECT email_address, first_name, last_name, phone_number
    FROM users
    WHERE user_id = ${userId}
    `)
    .then(dbRes =>  res.status(200).send(dbRes[0]))
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
  
    let { userId } = req.params

    sequelize
    .query(`
    SELECT default_tax_rate tax, default_rush_fee rush,

    default_density density, default_speed speed, default_base_piece_handling piece, default_setup setup_cost, default_setup_isIncluded setupcheck, default_template_space_between_items tem_between, default_template_space_from_left_ruler tem_left, default_template_space_from_top_ruler tem_top,

    break_one q1, break_two q2, break_three q3, break_four q4, break_five q5, break_six q6, break_seven q7,

    rate_one h1, rate_two h2, rate_three h3, rate_four h4, rate_five h5, rate_six h6, rate_seven h7

    FROM default_data AS dd
    JOIN default_job_data AS djd
      ON dd.user_id = djd.user_id
    JOIN qty_breaks AS qb
      ON qb.user_id = djd.user_id
    JOIN hourly_rates AS hr
      ON hr.user_id = qb.user_id
    WHERE dd.user_id = ${userId};

    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  }
}