// const { config } = require("dotenv");
// const mongoose = require("mongoose");
// require("dotenv").config();

// async function connectDB() {
//   try {
//     await mongoose.connect(config.MONGO_URI);
//     console.log("DB connected sucessfully");
//   } catch (err) {
//     console.error("DB connection error:", err);
//   }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");
const config = require("../config/config"); // adjust path if needed

async function connectDB() {
  try {
    if (!config.MONGO_URI) {
      throw new Error("MONGO_URI missing in .env");
    }

    await mongoose.connect(config.MONGO_URI);
    console.log(" DB connected successfully");
  } catch (err) {
    console.error(" DB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
