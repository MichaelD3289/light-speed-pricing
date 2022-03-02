const express = require('express');
const app = express();
require('dotenv').config();


//Middleware
app.use(express.json());

// DB seed request
const { seed } = require('../db/dbSeed');
app.post('/api/seed', seed);


// Post requests

// Get requests

// Delete requests

// Put requests


const port = process.env.PORT || process.env.SERVER_PORT;
app.listen(port, () => console.log(`Battleship docking at port ${port}`));