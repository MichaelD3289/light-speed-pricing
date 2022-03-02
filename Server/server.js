const express = require('express');
const app = express();
require('dotenv').config();


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/index.html'));
})

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Client')));

// DB seed request
const { seed } = require('../db/dbSeed');
app.post('/api/seed', seed);

const { addUser, userSignIn, addLaser, addFlatSpeedData, 
  addRotarySpeedData, addDefaultData, addJob, addFlatJob, 
  addCustomJobData, addJobDefaults, addDefaultHourlyRates, 
  addDefaultQtyBreaks, createInvoice, approveJob, completeJob } = require('./controllerFiles/ctrl-posts');


   // Users
app.post('/api/users', addUser);
app.post('/api/user', userSignIn);

  // User Defaults
app.post('api/user/defaults', addDefaultData);

  //lasers
app.post('/api/laser', addLaser);
app.post('/api/laser/flat/speed', addFlatSpeedData);
app.post('/api/laser/rotary/speed', addRotarySpeedData);

 // Jobs
app.post('/api/job', addJob);
app.post('/api/job/flat', addFlatJob);
app.post('/api/job/custom', addCustomJobData);
app.post('/api/job/defaults', addJobDefaults);
app.post('/api/job/defaults/qty', addDefaultQtyBreaks);
app.post('/api/job/defaults/rates', addDefaultHourlyRates);
app.post('/api/job/invoice-info', createInvoice);
app.post('/api/job/approved', approveJob);
app.post('/api/job/completed', completeJob);




const port = process.env.PORT || process.env.SERVER_PORT;
app.listen(port, () => console.log(`Battleship docking at port ${port}`));