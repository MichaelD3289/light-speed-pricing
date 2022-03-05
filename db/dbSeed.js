const Sequelize = require('sequelize');
require('dotenv').config();
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
  seed: (req, res) => {
    sequelize
      .query(`
      -- deleting tables prior to creation if they already exist
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS laser_machines CASCADE;
      DROP TABLE IF EXISTS laser_machine_speed_flat CASCADE;
      DROP TABLE IF EXISTS laser_machine_speed_rotary CASCADE;
      DROP TABLE IF EXISTS default_data CASCADE;
      DROP TABLE IF EXISTS default_job_data CASCADE;
      DROP TABLE IF EXISTS qty_breaks CASCADE;
      DROP TABLE IF EXISTS hourly_rates CASCADE;
      DROP TABLE IF EXISTS jobs_data CASCADE;
      DROP TABLE IF EXISTS jobs_data_flat CASCADE;
      DROP TABLE IF EXISTS custom_job_data CASCADE;
      DROP TABLE IF EXISTS invoice CASCADE;
      DROP TABLE IF EXISTS job_information CASCADE;
      DROP TABLE IF EXISTS approved_jobs CASCADE;
      DROP TABLE IF EXISTS completed_jobs CASCADE;
      
      -- Creating all tables
      
      CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,
      email_address VARCHAR(100) UNIQUE NOT NULL,
      user_password VARCHAR(500) NOT NULL,
      first_name VARCHAR(40) NOT NULL,
      last_name VARCHAR(40) NOT NULL,
      phone_number CHAR(10) NOT NULL
      );
      
      CREATE TABLE laser_machines(
      laser_id SERIAL PRIMARY KEY,
      table_width FLOAT NOT NULL,
      table_height FLOAT NOT NULL,
      added_by INT  NOT NULL UNIQUE REFERENCES users(user_id)
      );
      
      CREATE TABLE laser_machine_speed_flat(
      laser_machine_speed_flat_id SERIAL PRIMARY KEY,
      density_used INT NOT NULL,
      speed_used INT NOT NULL,
      flat_one_by_one FLOAT NOT NULL,
      flat_two_by_one FLOAT NOT NULL,
      flat_three_by_one FLOAT NOT NULL,
      flat_one_by_two FLOAT NOT NULL,
      flat_one_by_three FLOAT NOT NULL,
      flat_two_by_two FLOAT NOT NULL,
      flat_three_by_three FLOAT NOT NULL,
      laser_id INT NOT NULL UNIQUE REFERENCES laser_machines(laser_id)
      );
      
      CREATE TABLE laser_machine_speed_rotary(
      laser_machine_speed_rotary_id SERIAL PRIMARY KEY,
      density_used INT NOT NULL,
      speed_used INT NOT NULL,
      rotary_one_by_one FLOAT NOT NULL,
      rotary_two_by_one FLOAT NOT NULL,
      rotary_three_by_one FLOAT NOT NULL,
      rotary_one_by_two FLOAT NOT NULL,
      rotary_one_by_three FLOAT NOT NULL,
      rotary_two_by_two FLOAT NOT NULL,
      rotary_three_by_three FLOAT NOT NULL,
      laser_id UNIQUE INT NOT NULL REFERENCES laser_machines(laser_id)
      );
      
      CREATE TABLE default_data(
      default_id SERIAL PRIMARY KEY,
      default_tax_rate FLOAT NOT NULL,
      default_rush_fee FLOAT NOT NULL,
      user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
      );
      
      CREATE TABLE default_job_data(
      default_job_data_id SERIAL PRIMARY KEY,
      default_density INT NOT NULL,
      default_speed INT NOT NULL,
      default_base_piece_handling FLOAT NOT NULL,
      default_setup FLOAT NOT NULL,
      default_setup_isIncluded BOOLEAN NOT NULL,
      default_template_space_between_items FLOAT NOT NULL,
      default_template_space_from_left_ruler FLOAT NOT NULL,
      default_template_space_from_top_ruler FLOAT NOT NULL,
      user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
      );
      
      CREATE TABLE qty_breaks(
      qty_breaks_id SERIAL PRIMARY KEY,
      break_one INT NOT NULL,
      break_two INT NOT NULL,
      break_three INT NOT NULL,
      break_four INT NOT NULL,
      break_five INT NOT NULL,
      break_six INT NOT NULL,
      break_seven INT NOT NULL,
     user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
      );
      
      CREATE TABLE hourly_rates(
      hourly_rates_id SERIAL PRIMARY KEY,
      rate_one FLOAT NOT NULL,
      rate_two FLOAT NOT NULL,
      rate_three FLOAT NOT NULL,
      rate_four FLOAT NOT NULL,
      rate_five FLOAT NOT NULL,
      rate_six FLOAT NOT NULL,
      rate_seven FLOAT NOT NULL,
      user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
      );
      
      CREATE TABLE jobs_data(
      jobs_data_id SERIAL PRIMARY KEY,
      date_created TIMESTAMP NOT NULL,
      engraving_width FLOAT NOT NULL,
      engraving_height FLOAT NOT NULL,
      engraving_qty INT NOT NULL,
      speed INT NOT NULL,
      density INT NOT NULL,
      material VARCHAR(75) NOT NULL,
      is_rotary BOOLEAN NOT NULL DEFAULT FALSE,
      rush_required BOOLEAN NOT NULL DEFAULT FALSE,
      is_approved BOOLEAN NOT NULL DEFAULT FALSE,
      is_completed BOOLEAN NOT NULL DEFAULT FALSE,
      client_name VARCHAR(50) NOT NULL,
      user_id INT NOT NULL REFERENCES users(user_id)
      );
      
      CREATE TABLE jobs_data_flat(
      flat_jobs_data_id SERIAL PRIMARY KEY,
      item_width FLOAT NOT NULL,
      item_height FLOAT NOT NULL,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      CREATE TABLE custom_job_data(
      custom_job_data_id SERIAL PRIMARY KEY,
      custom_base_piece_handling FLOAT NOT NULL,
      custom_setup FLOAT NOT NULL,
      custom_setup_isIncluded BOOLEAN NOT NULL,
      custom_template_space_between_items FLOAT NOT NULL,
      custom_template_space_from_left_ruler FLOAT NOT NULL,
      custom_template_space_from_top_ruler FLOAT NOT NULL,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      CREATE TABLE invoice(
      invoice_id SERIAL PRIMARY KEY,
      unit_cost FLOAT NOT NULL,
      subtotal FLOAT NOT NULL,
      tax FLOAT NOT NULL,
      total FLOAT NOT NULL,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      CREATE TABLE job_information(
      job_information_id SERIAL PRIMARY KEY,
      unit_engraving_time FLOAT NOT NULL,
      piece_handling_time FLOAT NOT NULL,
      max_number_units_on_table INT NOT NULL,
      table_engraving_time FLOAT NOT NULL,
      total_time FLOAT NOT NULL,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      CREATE TABLE approved_jobs(
      approved_jobs_id SERIAL PRIMARY KEY,
      date_approved TIMESTAMP NOT NULL,
      rush_required BOOLEAN NOT NULL DEFAULT FALSE,
      promised_by_date DATE,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      CREATE TABLE completed_jobs(
      completed_jobs_id SERIAL PRIMARY KEY,
      completed_date TIMESTAMP NOT NULL,
      jobs_data_id INT NOT NULL REFERENCES jobs_data(jobs_data_id)
      );
      
      -- Starting with dummy data to use
      
      INSERT INTO users (email_address, user_password, first_name, last_name, phone_number)
      VALUES ('michael.test@email.com', 'password123', 'Michael', 'Drummond', '1234567890');
      
      INSERT INTO laser_machines (table_width, table_height, added_by)
      VALUES (48.0, 24.0, 1);
      
      INSERT INTO laser_machine_speed_flat (density_used, speed_used, flat_one_by_one, flat_two_by_one, flat_three_by_one, flat_one_by_two, flat_one_by_three, flat_two_by_two, flat_three_by_three, laser_id)
      VALUES (400, 70, 78.0, 86.0, 94.0, 156.0, 234.0, 172.0, 258.0, 1);
      
      INSERT INTO laser_machine_speed_rotary ( density_used, speed_used, rotary_one_by_one, rotary_two_by_one, rotary_three_by_one, rotary_one_by_two, rotary_one_by_three, rotary_two_by_two, rotary_three_by_three, laser_id)
      VALUES (400, 70, 88.0, 163.0, 238.0, 100.0, 110.0, 185.0, 302.0, 1);
      
      INSERT INTO default_data (default_tax_rate, default_rush_fee, user_id)
      VALUES (.0825, 0.30, 1);
      
      INSERT INTO default_job_data (default_density, default_speed, default_base_piece_handling, default_setup, default_setup_isIncluded, default_template_space_between_items, default_template_space_from_left_ruler, default_template_space_from_top_ruler, user_id)
      VALUES (400, 100, 12, 40, FALSE, 0.5, 0.5, 0.5, 1);
      
      INSERT INTO qty_breaks (break_one, break_two, break_three, break_four, break_five, break_six, break_seven, user_id)
      VALUES (1, 25, 50, 100, 250, 500, 1000,1);
      
      INSERT INTO hourly_rates (rate_one, rate_two, rate_three, rate_four, rate_five, rate_six, rate_seven, user_id)
      VALUES (200, 175, 150, 125, 115, 105, 95,1);
      
      INSERT INTO jobs_data (date_created, engraving_width, engraving_height, engraving_qty, speed, density, material, is_rotary, rush_required, is_approved, is_completed, client_name, user_id)
      VALUES ('2022-02-28 09:50:25', 2.5, 2.5, 50, 100, 400, 'maple wood', FALSE, FALSE, TRUE, TRUE, 'Dunder Mifflin', 1);
      
      INSERT INTO jobs_data_flat (item_width, item_height, jobs_data_id)
      VALUES (15.25, 10.5, 1);
      
      INSERT INTO custom_job_data (custom_base_piece_handling, custom_setup, custom_setup_isIncluded, custom_template_space_between_items, custom_template_space_from_left_ruler, custom_template_space_from_top_ruler, jobs_data_id)
      VALUES (15, 40, FALSE, 0.5, 0.5, 0.5, 1);
      
      INSERT INTO invoice (unit_cost, subtotal, tax, total, jobs_data_id)
      VALUES (2.75, 137.50, 11.34, 148.84, 1);
      
      INSERT INTO job_information (unit_engraving_time, piece_handling_time, max_number_units_on_table, table_engraving_time, total_time, jobs_data_id)
      VALUES (84, 12, 4, 336, 4200, 1);
      
      INSERT INTO approved_jobs (date_approved, rush_required, promised_by_date, jobs_data_id)
      VALUES ('2022-02-28 13:25:36', FALSE, '2022-03-04',1);
      
      INSERT INTO completed_jobs (completed_date, jobs_data_id)
      VALUES ('2022-03-01', 1);
      
      
      

      `)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err))
  }
}