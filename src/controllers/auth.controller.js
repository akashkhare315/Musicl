// const userModel = require("../models/user.model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// async function register(req, res) {
//   const {
//     email,
//     fullname: { firstName, lastName },
//     password,
//   } = req.body;
//   isUserExists = await userModel.findOne({ email });

//   if (isUserExists) {
//     res.status(400).json({ message: "User already Exists" });
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   if (!isUserExists) {
//     const user = await userModel.create({
//       email,
//       fullname: { firstName, lastName },
//       password,
//     });

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       config.JWT_SECRET,
//       { expiresIN: "2d" }
//     );
//     res.cookie("token", token);

//     res.status(201).json({
//       message: "user registerd successfully",
//       user: {
//         id: user._id,
//         email: user.email,
//         fullname: user.fullname,
//         role: user.role,
//       },
//     });
//   }
// }

// module.exports = { register };
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); // adjust path if needed

async function register(req, res) {
  try {
    const {
      email,
      fullname: { firstName, lastName },
      password,
    } = req.body;

    // ✅ check user exists
    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = await userModel.create({
      email,
      fullname: { firstName, lastName },
      password: hashedPassword,
    });

    // ✅ generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function googleAuthcallback(req, res) {
  const user = req.user;
  console.log(user);
  res.send("Google authentication successful");
}

module.exports = { register, googleAuthcallback };
