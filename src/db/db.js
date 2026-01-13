const mongoose = require("mongoose");
const config = require("../config/config")

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.error(" DB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
