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
  updateUser: (req, res) => {
 
    let { email, newPass, confirmPass, oldPass, fname, lname, phone, userId } = req.body

    userId = sequelize.escape(userId)

    sequelize
    .query(`
    SELECT * FROM users
    WHERE user_id = ${userId};
    `)
    .then(dbRes => {
    
      const { email_address, user_password, first_name, last_name, phone_number } = dbRes[0][0];

      let existing = bcrypt.compareSync(oldPass, user_password)
   
      let passHash;

      if(existing) {

        if(!confirmPass) {
          passHash = user_password
        } else {
          let salt = bcrypt.genSaltSync(10);
          passHash = bcrypt.hashSync(confirmPass, salt);
        }
      
        if(!email) {
          email = email_address
        }
        if(!fname) {
          fname = first_name
        }

        if(!lname) {
          lname = last_name
        }
        if(!phone) {
          phone = phone_number
        }

        email = sequelize.escape(email)
        fname = sequelize.escape(fname)
        lname = sequelize.escape(lname)
        phone = sequelize.escape(phone)

        sequelize
          .query(`
          UPDATE users
          SET email_address = ${email}, 
           user_password = '${passHash}', 
           first_name = ${fname}, 
           last_name = ${lname},
           phone_number = ${phone}
          WHERE user_id = ${userId};
          `)
          .then(dbRes => res.status(200).send({"message": "success"}))
          .catch(() => {
            res.status(200).send({"message": "email already exists"})
          })

     } else {
       res.status(200).send({"message":"incorrect password"})
     }

    })
    .catch(err => res.status(500).send(err))
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