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
      INSERT INTO users (email_address, user_password, first_name, last_name, phone_number)
      VALUES (${email}, '${passHash}', ${fname}, ${lname}, ${phone})
      RETURNING user_id;
    `)
    .then(dbRes => res.status(200).send(dbRes[0])) 
    .catch(err => res.status(400).send(err))
  },
  userSignIn: (req, res) => {
    let {email, password} = req.body;

    email = sequelize.escape(email);

    sequelize
    .query(`
    SELECT user_id, user_password FROM users
    WHERE email_address = ${email};
    `)
    .then(dbRes => {

      let dbPass = dbRes[0][0].user_password;
      let userId = dbRes[0][0].user_id;

      let existing = bcrypt.compareSync(password, dbPass)
      
      if(existing) {
         res.status(200).send({"message": userId});
      } else {
        res.status(200).send({"message": "Incorrect Password"})
      }
    })
    .catch(() => res.status(200).send({"message": "Incorrect Email"}))
  },

  addLaser: (req, res) => {
    let { tableW, tableH, user } = req.body.laser;
    let { fdensity, fspeed, fone, ftwoOne, fthreeOne, foneTwo, foneThree, ftwoTwo, fthreeThree } = req.body.flat
    let { rdensity, rspeed, rone, rtwoOne, rthreeOne, roneTwo, roneThree, rtwoTwo, rthreeThree } = req.body.rotary

  // calculations for speed data tables
      //flat
    let fAvgTimeInchSpeed = ((+ftwoOne - +fone) + (+fthreeOne - +ftwoOne) + ((+ftwoTwo - +foneTwo) / 2) + ((+fthreeThree - +foneThree) / 6)) / 4;
    let fAvgFirstInch = ((+foneThree - +foneTwo) + (+foneTwo - +fone)) / 2
    let fmoveTime = +fone - fAvgFirstInch;
    let fFixedPassTime =  (fAvgFirstInch - fAvgTimeInchSpeed) / fdensity;
    let fInchPerSecond = 1 / (fAvgTimeInchSpeed / +fdensity);

      //rotary
    let rAvgTimeInchSpeed = ((+roneTwo - +rone) + (+roneThree - +roneTwo) + ((+rtwoTwo - +rtwoOne) / 2) + ((+rthreeThree - +rthreeOne) / 6)) / 4;
    let rAvgFirstInch = ((+rthreeOne - +rtwoOne) + (+rtwoOne - +rone)) / 2
    let rmoveTime = +rone - rAvgFirstInch;
    let rFixedPassTime =  (rAvgFirstInch - rAvgTimeInchSpeed) / rdensity;
    let rInchPerSecond = 1 / (rAvgTimeInchSpeed / +rdensity);


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

        INSERT INTO laser_speed_flat_data (fixed_pass_time_f, fixed_move_time_f, inches_per_sec_f, user_id)
        VALUES (${fFixedPassTime}, ${fmoveTime}, ${fInchPerSecond}, ${user})
        ON CONFLICT (user_id)
        DO UPDATE SET
        fixed_pass_time_f = EXCLUDED.fixed_pass_time_f,
        fixed_move_time_f = EXCLUDED.fixed_move_time_f,
        inches_per_sec_f = EXCLUDED.inches_per_sec_f,
        user_id = EXCLUDED.user_id;

        INSERT INTO laser_speed_rotary_data (fixed_pass_time_r, fixed_move_time_r, inches_per_sec_r, user_id)
        VALUES (${rFixedPassTime}, ${rmoveTime}, ${rInchPerSecond}, ${user})
        ON CONFLICT (user_id)
        DO UPDATE SET
        fixed_pass_time_r = EXCLUDED.fixed_pass_time_r,
        fixed_move_time_r = EXCLUDED.fixed_move_time_r,
        inches_per_sec_r = EXCLUDED.inches_per_sec_r,
        user_id = EXCLUDED.user_id;

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
    let { width, height, qty, speed, density, rotary, client, job, userId } = req.body.main;

    let { itemWidth, itemHeight } = req.body.flat
    let { numLasers } = req.body.rotary
    let { unitCost, setUpCost, subtotalCost, taxCost, totalCost } = req.body.invoice

    width = sequelize.escape(width);
    height = sequelize.escape(height);
    qty = sequelize.escape(qty);
    speed = sequelize.escape(speed);
    density = sequelize.escape(density);

    client = sequelize.escape(client);
    job = sequelize.escape(job);
    userId = sequelize.escape(userId);

    unitCost = sequelize.escape(unitCost);
    setUpCost = sequelize.escape(setUpCost);
    subtotalCost = sequelize.escape(subtotalCost);
    taxCost = sequelize.escape(taxCost);
    totalCost = sequelize.escape(totalCost);
    
    

      sequelize
      .query(`
      INSERT INTO jobs_data ( date_created, engraving_width, engraving_height, engraving_qty, speed, density, is_rotary, client_name, job_name, user_id)
      VALUES ( NOW(), ${width}, ${height}, ${qty}, ${speed}, ${density}, ${rotary}, ${client}, ${job}, ${userId})
      ON CONFLICT (user_id)
      DO UPDATE SET
      date_created = EXCLUDED.date_created,
      engraving_width = EXCLUDED.engraving_width,
      engraving_height = EXCLUDED.engraving_height,
      engraving_qty = EXCLUDED.engraving_qty,
      speed = EXCLUDED.speed,
      density = EXCLUDED.density,
      is_rotary = EXCLUDED.is_rotary,
      client_name = EXCLUDED.client_name,
      job_name = EXCLUDED.job_name,
      user_id = EXCLUDED.user_id
      RETURNING jobs_data_id;      

      `)
      .then(dbRes => {
 
        let jobsDataId = dbRes[0][0].jobs_data_id
        

        if(rotary == false) {
          
          itemHeight = sequelize.escape(itemHeight);
          itemWidth = sequelize.escape(itemWidth);

          sequelize
            .query(`
            
            INSERT INTO invoice (unit_cost, setup, subtotal, tax, total, jobs_data_id)
            VALUES(${unitCost}, ${setUpCost}, ${subtotalCost}, ${taxCost}, ${totalCost}, ${jobsDataId})
            ON CONFLICT (jobs_data_id)
            DO UPDATE SET
            unit_cost = EXCLUDED.unit_cost,
            subtotal = EXCLUDED.subtotal,
            tax = EXCLUDED.tax,
            total = EXCLUDED.total,
            jobs_data_id = EXCLUDED.jobs_data_id;

            INSERT INTO jobs_data_flat (item_width, item_height, jobs_data_id)
            VALUES (${itemWidth}, ${itemHeight}, ${jobsDataId})
            ON CONFLICT (jobs_data_id)
            DO UPDATE SET
            item_width = EXCLUDED.item_width,
            item_height = EXCLUDED.item_height,
            jobs_data_id = EXCLUDED.jobs_data_id;

            DELETE
            FROM jobs_data_rotary
            WHERE jobs_data_id = ${jobsDataId};

            `)
            .then(dbRes => res.sendStatus(200))
            .catch(err => res.status(400).send(err))
        } else if (rotary == true) {

          numLasers = sequelize.escape(numLasers)

          sequelize
          .query(`
          INSERT INTO invoice (unit_cost, setup, subtotal, tax, total, jobs_data_id)
            VALUES(${unitCost}, ${setUpCost}, ${subtotalCost}, ${taxCost}, ${totalCost}, ${jobsDataId})
            ON CONFLICT (jobs_data_id)
            DO UPDATE SET
            unit_cost = EXCLUDED.unit_cost,
            subtotal = EXCLUDED.subtotal,
            tax = EXCLUDED.tax,
            total = EXCLUDED.total,
            jobs_data_id = EXCLUDED.jobs_data_id;

          INSERT INTO jobs_data_rotary (num_lasers, jobs_data_id)
          VALUES (${numLasers}, ${jobsDataId})
          ON CONFLICT (jobs_data_id)
          DO UPDATE SET
          num_lasers = EXCLUDED.num_lasers,
          jobs_data_id = EXCLUDED.jobs_data_id;

          DELETE
          FROM jobs_data_flat
          WHERE jobs_data_id = ${jobsDataId};

          `)
          .then(dbRes => res.sendStatus(200))
          .catch(err => res.status(400).send(err))
        }

      })
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