"use strict";

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/", userRouter);

module.exports = app;
