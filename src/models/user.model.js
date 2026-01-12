const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { Type: String, required: true, unique: true },
    fullname: { Type: String, required: true },
    password: { Type: String, required: () => !this.googleId },
    googleId: { Type: String },
    role: { Type: String, enum: ["user", "artist"], default: "user" },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
