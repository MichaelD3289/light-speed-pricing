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
      userId = sequelize.escape(userId)
    
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
  
    let { userId } = req.params;

    userId = sequelize.escape(userId)

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
  },
  
getDefaultsAndLaser: (req, res) => {
   
    let { userId, jobSaved } = req.query


    userId = sequelize.escape(userId)
    
if(jobSaved === 'no') {

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

SELECT table_width, table_height,
f.density_used fdensity, f.speed_used fspeed,
r.density_used rdensity, r.speed_used rspeed

FROM laser_machines AS lm
JOIN laser_machine_speed_flat AS f
ON lm.laser_id = f.laser_id
JOIN laser_machine_speed_rotary AS r
ON f.laser_id = r.laser_id
WHERE added_by = ${userId};

SELECT 
fixed_pass_time_f fPass, fixed_move_time_f fMove, inches_per_sec_f fInches,

fixed_pass_time_r rPass, fixed_move_time_r rMove, inches_per_sec_r  rInches

FROM laser_speed_flat_data AS lsfd
JOIN laser_speed_rotary_data AS lsrd
ON lsfd.user_id = lsrd.user_id
WHERE lsfd.user_id = ${userId};
  `)
  .then(dbRes => {
    
    res.status(200).send(dbRes[0])
  
  })
  .catch(err => {
    res.status(400).send(err)
  })

} else if(jobSaved === 'rotary') {

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

  SELECT table_width, table_height,
  f.density_used fdensity, f.speed_used fspeed,
  r.density_used rdensity, r.speed_used rspeed

  FROM laser_machines AS lm
  JOIN laser_machine_speed_flat AS f
  ON lm.laser_id = f.laser_id
  JOIN laser_machine_speed_rotary AS r
  ON f.laser_id = r.laser_id
  WHERE added_by = ${userId};

  SELECT 
  fixed_pass_time_f fPass, fixed_move_time_f fMove, inches_per_sec_f fInches,

  fixed_pass_time_r rPass, fixed_move_time_r rMove, inches_per_sec_r  rInches

  FROM laser_speed_flat_data AS lsfd
  JOIN laser_speed_rotary_data AS lsrd
  ON lsfd.user_id = lsrd.user_id
  WHERE lsfd.user_id = ${userId};


  SELECT engraving_width, engraving_height, engraving_qty, speed, density, is_rotary, client_name, job_name,

  num_lasers,

  unit_cost, setup, subtotal, tax, total
    FROM jobs_data AS jd
  JOIN jobs_data_rotary AS jdr
  ON jdr.jobs_data_id = jd.jobs_data_id
  JOIN invoice AS i
  ON i.jobs_data_id = jdr.jobs_data_id
    WHERE jd.user_id = ${userId};
  `)
  .then(dbRes => {
   
    res.status(200).send(dbRes[0])
  })
  .catch(err => res.status(400).send(err))

} else if(jobSaved === 'standard') {

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

  SELECT table_width, table_height,
  f.density_used fdensity, f.speed_used fspeed,
  r.density_used rdensity, r.speed_used rspeed

  FROM laser_machines AS lm
  JOIN laser_machine_speed_flat AS f
  ON lm.laser_id = f.laser_id
  JOIN laser_machine_speed_rotary AS r
  ON f.laser_id = r.laser_id
  WHERE added_by = ${userId};

  SELECT 
  fixed_pass_time_f fPass, fixed_move_time_f fMove, inches_per_sec_f fInches,

  fixed_pass_time_r rPass, fixed_move_time_r rMove, inches_per_sec_r  rInches

  FROM laser_speed_flat_data AS lsfd
  JOIN laser_speed_rotary_data AS lsrd
  ON lsfd.user_id = lsrd.user_id
  WHERE lsfd.user_id = ${userId};
  
  SELECT engraving_width, engraving_height, engraving_qty, speed, density, is_rotary, client_name, job_name,

  item_width, item_height,

  unit_cost, setup, subtotal, tax, total

  FROM jobs_data AS jd
  JOIN jobs_data_flat AS jdf
  ON  jd.jobs_data_id = jdf.jobs_data_id
  JOIN invoice AS i
  ON i.jobs_data_id = jdf.jobs_data_id

  WHERE jd.user_id = ${userId};

  `)
  .then(dbRes => {
 
    res.status(200).send(dbRes[0])
  })
  .catch(err => res.status(400).send(err))

}
      


},

  searchSavedJobs: (req, res) => {
    let userId = req.params.userId;

    sequelize
      .query(`
      SELECT jobs_data_id, is_rotary FROM jobs_data
      WHERE user_id = ${userId};
      
      `)
      .then(dbRes => {
        let is_rotary;
      let rowCount = dbRes[1].rowCount;
      if(rowCount === 0) {
        res.status(200).send({"message": "no"})
      } else if (rowCount > 0) {
       is_rotary = dbRes[0][0].is_rotary
        if(is_rotary) {
          res.status(200).send({"message": "rotary"})
        } else if (!is_rotary) {
          res.status(200).send({"message": "standard"})
        }
      }

      })
      .catch(err => console.log(err))

  },

  getToDoList: (req, res) => {
    let { userId } = req.params;

    sequelize
      .query(`
      SELECT laser_id 
      FROM laser_machines
      WHERE added_by = ${userId};

    
      `)
      .then(dbRes => {
        let laserIdFound

        if(dbRes[1].rowCount > 0) {
  
          laserIdFound = true
        } else {
          laserIdFound = false
        }

        sequelize
          .query(`
          SELECT default_job_data_id
          FROM default_job_data
          WHERE user_id = ${userId};
          `)
          .then(dbRes => {
            let defaultIdFound;
      
            if(dbRes[1].rowCount > 0) {
              defaultIdFound = true
            } else {
              defaultIdFound = false
            }

            res.status(200).send({"laserId": laserIdFound, "defaultId": defaultIdFound})

          })
          .catch(err => res.status(400).send(err))

      })
      .catch(err => res.status(400).send(err))
  }
 
}