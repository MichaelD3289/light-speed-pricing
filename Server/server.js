const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/index.html"));
});

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Client")));

// DB seed request
const { seed } = require("../db/dbSeed");
app.post("/api/seed", seed);

const {
  addUser,
  userSignIn,
  addLaser,
  addDefaultData,
  addJob,
  addFlatJob,
  addCustomJobData,
  createInvoice,
  createJobInfo,
} = require("./controllerFiles/ctrl-posts");

const {
  getAllJobs,
  getApprovedJobs,
  getCompletedJobs,
  getUserInfo,
  getLaser,
  getUserDefaults,
  getDefaultsAndLaser,
  searchSavedJobs,
  getToDoList,
} = require("./controllerFiles/ctrl-get");

const {
  deleteUser,
  deleteLaser,
  deleteJob,
} = require("./controllerFiles/ctrl-delete");

const {
  updateUser,
  updateLaser,
  updateJob,
  updateFlatJob,
  updateCustomJobData,
  updateJobApproved,
  updateJobCompleted,
} = require("./controllerFiles/ctrl-put");

// Users
app.post("/api/users", addUser);
app.post("/api/user", userSignIn);
app.get("/api/user/:userId", getUserInfo);
app.put("/api/user/:userId", updateUser);
app.delete("/api/user/:userId", deleteUser);

// User Defaults
app.post("/api/user/defaults", addDefaultData);
app.get("/api/user/defaults/:userId", getUserDefaults);

//lasers
app.post("/api/laser", addLaser);
app.get("/api/laser/:userId", getLaser);
app.put("/api/laser/:laserId", updateLaser);
app.delete("/api/laser/laserId", deleteLaser);

// Jobs
app.post("/api/job", addJob);
app.get("/api/jobs/:userId", getAllJobs);
app.put("/api/job/:jobsDataId", updateJob);
app.delete("/api/job/:userId", deleteJob);
app.get("/api/jobs/saved/:userId", searchSavedJobs);

app.post("/api/job/flat", addFlatJob);
app.put("/api/job/flat/:jobsDataId", updateFlatJob);
app.post("/api/job/custom", addCustomJobData);
app.put("/api/job/custom/:jobsDataId", updateCustomJobData);

app.post("/api/job/invoice", createInvoice);
app.post("/api/job/info", createJobInfo);

app.get("/api/jobs/approved/:userId", getApprovedJobs);
app.put("/api/job/approved/:jobDataId", updateJobApproved);

app.get("/api/jobs/completed/:userId", getCompletedJobs);
app.put("/api/job/completed/:jobDataId", updateJobCompleted);
app.get("/api/user/laser/defaults", getDefaultsAndLaser);

app.get("/api/action-items/:userId", getToDoList);

const port = process.env.PORT || process.env.SERVER_PORT;
app.listen(port, () => console.log(`Battleship docking at port ${port}`));
