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
    let { tableW, tableH, user } = req.body.laser;
    let { fdensity, fspeed, fone, ftwoOne, fthreeOne, foneTwo, foneThree, ftwoTwo, fthreeThree } = req.body.flat
    let { rdensity, rspeed, rone, rtwoOne, rthreeOne, roneTwo, roneThree, rtwoTwo, rthreeThree } = req.body.rotary

    tableH = sequelize.escape(tableH);
    tableW = sequelize.escape(tableW);

    fdensity = sequelize.escape(fdensity);
    fspeed = sequelize.escape(fspeed)
    fone = sequelize.escape(fone)
    ftwoOne =sequelize.escape(ftwoOne)
    fthreeOne = sequelize.escape(fthreeOne)
    foneTwo = sequelize.escape(foneTwo)
    foneThree = sequelize.escape(foneThree)
    ftwoTwo = sequelize.escape(ftwoTwo)
    fthreeThree = sequelize.escape(fthreeThree)

    rdensity = sequelize.escape(rdensity);
    rspeed = sequelize.escape(rspeed)
    rone = sequelize.escape(rone)
    rtwoOne =sequelize.escape(rtwoOne)
    rthreeOne = sequelize.escape(rthreeOne)
    roneTwo = sequelize.escape(roneTwo)
    roneThree = sequelize.escape(roneThree)
    rtwoTwo = sequelize.escape(rtwoTwo)
    rthreeThree = sequelize.escape(rthreeThree)

    sequelize
    .query(`
    INSERT INTO laser_machines (table_width, table_height, added_by)
    VALUES(${tableW}, ${tableH}, ${user})
    ON CONFLICT (added_by)
    DO UPDATE SET 
    table_width = EXCLUDED.table_width, 
    table_height = EXCLUDED.table_height, 
    added_by = EXCLUDED.added_by
    RETURNING *;
    `)
    .then(dbRes => {
      let laserId = dbRes[0][0].laser_id;
      console.log(laserId)
      
      sequelize
        .query(`
        INSERT INTO laser_machine_speed_flat (density_used, speed_used, flat_one_by_one, flat_two_by_one, flat_three_by_one, flat_one_by_two, flat_one_by_three, flat_two_by_two, flat_three_by_three, laser_id)
         VALUES (${fdensity}, ${fspeed}, ${fone}, ${ftwoOne}, ${fthreeOne}, ${foneTwo}, ${foneThree}, ${ftwoTwo}, ${fthreeThree}, ${laserId})
         ON CONFLICT (laser_id)
         DO UPDATE SET
         density_used = EXCLUDED.density_used, 
         speed_used = EXCLUDED.speed_used, 
         flat_one_by_one = EXCLUDED.flat_one_by_one, 
         flat_two_by_one = EXCLUDED.flat_two_by_one, 
         flat_three_by_one = EXCLUDED.flat_three_by_one, 
         flat_one_by_two = EXCLUDED.flat_one_by_two, 
         flat_one_by_three = EXCLUDED.flat_one_by_three, 
         flat_two_by_two = EXCLUDED.flat_two_by_two, 
         flat_three_by_three = EXCLUDED.flat_three_by_three, 
         laser_id = EXCLUDED.laser_id
         RETURNING *;

        INSERT INTO laser_machine_speed_rotary ( density_used, speed_used, rotary_one_by_one, rotary_two_by_one, rotary_three_by_one, rotary_one_by_two, rotary_one_by_three, rotary_two_by_two, rotary_three_by_three, laser_id)
        VALUES (${rdensity}, ${rspeed}, ${rone}, ${rtwoOne}, ${rthreeOne}, ${roneTwo}, ${roneThree}, ${rtwoTwo}, ${rthreeThree}, ${laserId})
        ON CONFLICT (laser_id)
        DO UPDATE SET
        density_used = EXCLUDED.density_used, 
         speed_used = EXCLUDED.speed_used, 
         rotary_one_by_one = EXCLUDED.rotary_one_by_one, 
         rotary_two_by_one = EXCLUDED.rotary_two_by_one, 
         rotary_three_by_one = EXCLUDED.rotary_three_by_one, 
         rotary_one_by_two = EXCLUDED.rotary_one_by_two, 
         rotary_one_by_three = EXCLUDED.rotary_one_by_three, 
         rotary_two_by_two = EXCLUDED.rotary_two_by_two, 
         rotary_three_by_three = EXCLUDED.rotary_three_by_three, 
         laser_id = EXCLUDED.laser_id
        RETURNING *;

        `).then(dbRes => res.status(200).send(dbRes))
        .catch(err=> res.status(400).send(err))
      
    })
    .catch(err => res.status(400).send(err))
  },

  addDefaultData: (req, res) => {

    let { user } = req.body
    let { tax, rush } = req.body.company
    let { density, speed, piece, setup, setupInc, temBetween, temLeft, temTop } = req.body.job
    let { qone, qtwo, qthree, qfour, qfive, qsix, qseven } = req.body.qty
    sequelize
    let { hone, htwo, hthree, hfour, hfive, hsix, hseven} = req.body.hourly
    sequelize

    user = sequelize.escape(user)
    tax = sequelize.escape(tax)
    rush = sequelize.escape(rush)

    density = sequelize.escape(density)
    speed = sequelize.escape(speed)
    piece = sequelize.escape(piece)
    setup = sequelize.escape(setup)
    setupInc = sequelize.escape(setupInc)
    temBetween = sequelize.escape(temBetween)
    temLeft = sequelize.escape(temLeft)
    temTop = sequelize.escape(temTop)

    qone = sequelize.escape(qone)
    qtwo = sequelize.escape(qtwo)
    qthree = sequelize.escape(qthree)
    qfour = sequelize.escape(qfour)
    qfive = sequelize.escape(qfive)
    qsix = sequelize.escape(qsix)
    qseven = sequelize.escape(qseven)

    hone = sequelize.escape(hone)
    htwo = sequelize.escape(htwo)
    hthree = sequelize.escape(hthree)
    hfour = sequelize.escape(hfour)
    hfive = sequelize.escape(hfive)
    hsix = sequelize.escape(hsix)
    hseven = sequelize.escape(hseven)

    sequelize
    .query(`
    INSERT INTO default_data (default_tax_rate, default_rush_fee, user_id)
    VALUES (${tax}, ${rush}, ${user})
    ON CONFLICT (user_id)
    DO UPDATE SET
    default_tax_rate = EXCLUDED.default_tax_rate,
    default_rush_fee = EXCLUDED.default_rush_fee,
    user_id = EXCLUDED.user_id;

    INSERT INTO default_job_data (default_density, default_speed, default_base_piece_handling, default_setup, default_setup_isIncluded, default_template_space_between_items, default_template_space_from_left_ruler, default_template_space_from_top_ruler, user_id)
    VALUES (${density}, ${speed}, ${piece}, ${setup}, ${setupInc}, ${temBetween}, ${temLeft}, ${temTop}, ${user})
    ON CONFLICT (user_id)
    DO UPDATE SET
    default_density = EXCLUDED.default_density,
    default_speed = EXCLUDED.default_speed,
    default_base_piece_handling = EXCLUDED.default_base_piece_handling,
    default_setup = EXCLUDED.default_setup,
    default_setup_isIncluded = EXCLUDED.default_setup_isIncluded,
    default_template_space_between_items = EXCLUDED.default_template_space_between_items,
    default_template_space_from_left_ruler = EXCLUDED.default_template_space_from_left_ruler,
    default_template_space_from_top_ruler = EXCLUDED.default_template_space_from_top_ruler,
    user_id = EXCLUDED.user_id;

    INSERT INTO qty_breaks (break_one, break_two, break_three, break_four, break_five, break_six, break_seven, user_id)
    VALUES (${qone}, ${qtwo}, ${qthree}, ${qfour}, ${qfive}, ${qsix}, ${qseven}, ${user})
    ON CONFLICT (user_id)
    DO UPDATE SET
    break_one = EXCLUDED.break_one,
    break_two = EXCLUDED.break_two,
    break_three = EXCLUDED.break_three,
    break_four = EXCLUDED.break_four,
    break_five = EXCLUDED.break_five,
    break_six = EXCLUDED.break_six,
    break_seven = EXCLUDED.break_seven,
    user_id = EXCLUDED.user_id;

    INSERT INTO hourly_rates (rate_one, rate_two, rate_three, rate_four, rate_five, rate_six, rate_seven, user_id)
    VALUES (${hone}, ${htwo}, ${hthree}, ${hfour}, ${hfive}, ${hsix}, ${hseven}, ${user})
    ON CONFLICT (user_id)
    DO UPDATE SET
    rate_one = EXCLUDED.rate_one,
    rate_two = EXCLUDED.rate_two,
    rate_three = EXCLUDED.rate_three,
    rate_four = EXCLUDED.rate_four,
    rate_five = EXCLUDED.rate_five,
    rate_six = EXCLUDED.rate_six,
    rate_seven = EXCLUDED.rate_seven,
    user_id = EXCLUDED.user_id;
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