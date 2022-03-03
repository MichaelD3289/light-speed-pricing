require('dotenv').config();
const bcrypt = require('bcrypt');

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
    let { email, password, fname, lname, phone } = req.body;
    let salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(password, salt);

   email = sequelize.escape(email);
   fname = sequelize.escape(fname);
   lname = sequelize.escape(lname);
   phone = sequelize.escape(phone);

   sequelize
    .query(` 
      INSERT INTO users (email_address, password, first_name, last_name, phone_number)
      VALUES (${email}, '${passHash}', ${fname}, ${lname}, ${phone})
      RETURNING user_id;
    `)
    .then(dbRes => res.status(200).send(dbRes[0])) 
    .catch(err => res.status(400).send(console.log(err)))
  },
  userSignIn: (req, res) => {
    let {email, password} = req.body;

    email = sequelize.escape(email);

    sequelize
    .query(`
    SELECT user_id, password FROM users
    WHERE email_address = ${email};
    `)
    .then(dbRes => {
      let dbPass = dbRes[0][0].password;
      let userId = dbRes[0][0].user_id;
      userId = userId.toString();
      let existing = bcrypt.compareSync(password, dbPass)
      
      if(existing) {
         res.status(200).send(userId);
      } else {
        res.status(400).send('Incorrect Password')
      }
    })
    .catch(err => res.status(400).send(err))
  },
  addLaser: (req, res) => {
    const { tableW, tableH, user } = req.body;

    sequelize
    .query(`
    INSERT INTO laser_machines (table_width, table_height, added_by)
    VALUES(${+tableW}, ${+tableH}, ${+user})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addFlatSpeedData: (req, res) => {
    const { density, one, twoOne, threeOne, oneTwo, oneThree, twoTwo, threeThree, laserId } = req.body
    sequelize
    .query(`
    INSERT INTO laser_machine_speed_flat (density_used, flat_one_by_one, flat_two_by_one, flat_three_by_one, flat_one_by_two, flat_one_by_three, flat_two_by_two, flat_three_by_three, laser_id)
    VALUES (${+density}, ${+one}, ${+twoOne}, ${+threeOne}, ${+oneTwo}, ${+oneThree}, ${+twoTwo}, ${+threeThree}, ${+laserId})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addRotarySpeedData: (req, res) => {
    const { density, one, twoOne, threeOne, oneTwo, oneThree, twoTwo, threeThree, laserId } = req.body
    sequelize
    .query(`
    INSERT INTO laser_machine_speed_rotary ( density_used, rotary_one_by_one, rotary_two_by_one, rotary_three_by_one, rotary_one_by_two, rotary_one_by_three, rotary_two_by_two, rotary_three_by_three, laser_id)
    VALUES (${+density}, ${+one}, ${+twoOne}, ${+threeOne}, ${+oneTwo}, ${+oneThree}, ${+twoTwo}, ${+threeThree}, ${+laserId})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addDefaultData: (req, res) => {
    const { tax, rush, start, end, user } = req.body
    sequelize
    .query(`
    INSERT INTO default_data (default_tax_rate, default_rush_fee, hours_of_operations_start, hours_of_operations_end, user_id)
    VALUES (${+tax}, ${+rush}, '${start}', '${end}', ${+user})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addJobDefaults: (req, res) => {
    const { density, speed, piece, setup, setupInc, temBetween, temLeft, temTop, user } = req.body
    sequelize
    .query(`
    INSERT INTO default_job_data (default_density, default_speed, default_base_piece_handling, default_setup, default_setup_isIncluded, default_template_space_between_items, default_template_space_from_left_ruler, default_template_space_from_top_ruler, user_id)
    VALUES (${+density}, ${+speed}, ${+piece}, ${+setup}, ${setupInc}, ${+temBetween}, ${+temLeft}, ${+temTop}, ${+user})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addDefaultQtyBreaks: (req, res) => {
    const { one, two, three, four, five, six, seven, job } = req.body
    sequelize
    .query(`
    INSERT INTO qty_breaks (break_one, break_two, break_three, break_four, break_five, break_six, break_seven, default_job_data_id)
    VALUES (${+one}, ${+two}, ${+three}, ${+four}, ${+five}, ${+six}, ${+seven}, ${+job})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addDefaultHourlyRates: (req, res) => {
    const { one, two, three, four, five, six, seven, job } = req.body
    sequelize
    .query(`
    INSERT INTO hourly_rates (rate_one, rate_two, rate_three, rate_four, rate_five, rate_six, rate_seven, default_job_data_id)
    VALUES (${+one}, ${+two}, ${+three}, ${+four}, ${+five}, ${+six}, ${+seven}, ${+job})
    RETURNING *;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addJob: (req, res) => {
    const { date, width, height, qty, speed, density, material, rotary, rush, client, user } = req.body;
    sequelize
    .query(`
    INSERT INTO jobs_data (date_created, engraving_width, engraving_height, engraving_qty, speed, density, material, is_rotary, rush_required, is_approved, is_completed, client_name, user_id)
    VALUES ('${date}', ${+width}, ${+height}, ${+qty}, ${+speed}, ${+density}, "${material}", ${rotary}, ${rush}, '${client}, ${+user}')
    RETURNING jobs_data_id;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addFlatJob: (req, res) => {
    const {itemWidth, itemHeight, job} = req.body;
    sequelize
    .query(`
    INSERT INTO jobs_data_flat (item_width, item_height, jobs_data_id)
    VALUES(${+itemWidth}, ${+itemHeight}, ${+job})
    RETURNING jobs_data_flat_id;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  addCustomJobData: (req, res) => {
    const {piece, setup, setupInc, temBetween, temLeft, temTop, job} = req.body;
    sequelize
    .query(`
    INSERT INTO custom_job_data (custom_base_piece_handling, custom_setup, custom_setup_isIncluded, custom_template_space_between_items, custom_template_space_from_left_ruler, custom_template_space_from_top_ruler, jobs_data_id)
    VALUES (${+piece}, ${+setup}, ${setupInc}, ${+temBetween}, ${+temLeft}, ${+temTop}, ${+job})
    RETURNING custom_job_data_id; 
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  createInvoice: (req, res) => {
    const { unit, subtotal, tax, total, job } = req.body;
    sequelize
    .query(`
    INSERT INTO invoice (unit_cost, subtotal, tax, total, jobs_data_id)
    VALUES (${+unit}, ${+subtotal}, ${+tax}, ${+total}, ${+job})
    RETURNING invoice_id

    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  },
  createJobInfo: (req, res) => {
    const { unitTime, handlingTime, maxNumber, tableTime, totalTime, job } = req.body;
    sequelize
    .query(`
    INSERT INTO job_information (unit_engraving_time, piece_handling_time, max_number_units_on_table, table_engraving_time, total_time, jobs_data_id)
    VALUES (${+unitTime}, ${+handlingTime}, ${+maxNumber}, ${+tableTime}, ${+totalTime}, ${+job})
    RETURNING job_information_id;
    `)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(err => res.status(400).send(err))
  }
}