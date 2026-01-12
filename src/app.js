const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);

module.exports = app;
