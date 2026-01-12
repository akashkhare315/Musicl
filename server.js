const express = require("express");
const app = require("./src/app");
const connectDB = require("./src/db/db");
require("dotenv").config();

connectDB();

app.listen(3000, () => {
  console.log("Auth service running port on 3000");
});
